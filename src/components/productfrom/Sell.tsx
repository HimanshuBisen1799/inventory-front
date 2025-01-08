import React, { useState, useEffect, useRef } from "react";
import SalesService, { SaleProduct } from "../../services/Sales.service";
import { Printer, Barcode, PenLine, Plus, Trash2, ArrowRight } from 'lucide-react';

interface ProductDetails {
  sku: string;
  quantitySold: number;
  name?: string;
  sellingPrice?: number;
  totalAmount?: number;
}

const Selladd: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState({
    products: [{ sku: "", quantitySold: 1 }] as ProductDetails[],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(true);
  const [scanBuffer, setScanBuffer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isManualEntry) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isScanning) {
        setIsScanning(true);
        setScanBuffer("");
      }

      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      if (e.key.length === 1 || e.key === "Enter") {
        setScanBuffer(prev => prev + e.key);
      }

      scanTimeoutRef.current = setTimeout(() => {
        if (scanBuffer) {
          processScanComplete(scanBuffer.replace("Enter", ""));
        }
        setIsScanning(false);
        setScanBuffer("");
      }, 100);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isScanning, scanBuffer, isManualEntry]);

  const toggleEntryMode = () => {
    setIsManualEntry(!isManualEntry);
    setIsScanning(false);
  };

  const fetchProductDetails = async (sku: string) => {
    try {
      const response = await fetch(`/api/products/sku/${sku}`);
      const data = await response.json();
      return {
        name: data.name,
        sellingPrice: data.sellingPrice,
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const processScanComplete = async (scannedSku: string) => {
    const productDetails = await fetchProductDetails(scannedSku);
    if (!productDetails) {
      alert('Product not found!');
      return;
    }

    updateProductInList(scannedSku, 1, productDetails);
  };

  const updateProductInList = (sku: string, quantity: number, productDetails: any) => {
    const updatedProducts = [...saleDetails.products];
    const existingProductIndex = updatedProducts.findIndex(p => p.sku === sku);

    if (existingProductIndex >= 0) {
      const newQuantity = updatedProducts[existingProductIndex].quantitySold + quantity;
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantitySold: newQuantity,
        totalAmount: newQuantity * (productDetails.sellingPrice || 0),
      };
    } else {
      updatedProducts.push({
        sku,
        quantitySold: quantity,
        name: productDetails.name,
        sellingPrice: productDetails.sellingPrice,
        totalAmount: quantity * productDetails.sellingPrice,
      });
    }

    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
    }));

    calculateTotal(updatedProducts);
  };

  const calculateTotal = (products: ProductDetails[]) => {
    const total = products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
    setTotalAmount(total);
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: "products"
  ) => {
    const { name, value } = e.target;
    
    if (field === "products" && index !== undefined) {
      const updatedProducts = [...saleDetails.products];
      
      if (name === "sku") {
        if (value === updatedProducts[index].sku) return;
        
        const productDetails = await fetchProductDetails(value);
        if (productDetails) {
          updatedProducts[index] = {
            ...updatedProducts[index],
            sku: value,
            name: productDetails.name,
            sellingPrice: productDetails.sellingPrice,
            totalAmount: productDetails.sellingPrice * updatedProducts[index].quantitySold,
          };
        }
      } else if (name === "quantitySold") {
        const quantity = parseInt(value) || 1;
        updatedProducts[index] = {
          ...updatedProducts[index],
          quantitySold: quantity,
          totalAmount: quantity * (updatedProducts[index].sellingPrice || 0),
        };
      }
      
      setSaleDetails({ ...saleDetails, products: updatedProducts });
      calculateTotal(updatedProducts);
    } else {
      setSaleDetails({ ...saleDetails, [name]: value });
    }
  };

  const handleSkuBlur = async (index: number) => {
    const product = saleDetails.products[index];
    if (product.sku && !product.name) {
      const productDetails = await fetchProductDetails(product.sku);
      if (productDetails) {
        const updatedProducts = [...saleDetails.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          name: productDetails.name,
          sellingPrice: productDetails.sellingPrice,
          totalAmount: productDetails.sellingPrice * updatedProducts[index].quantitySold,
        };
        setSaleDetails({ ...saleDetails, products: updatedProducts });
        calculateTotal(updatedProducts);
      }
    }
  };

  const addProductField = () => {
    setSaleDetails({
      ...saleDetails,
      products: [...saleDetails.products, { sku: "", quantitySold: 1 }],
    });
  };

  const removeProductField = (index: number) => {
    if (saleDetails.products.length > 1) {
      const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
      setSaleDetails({ ...saleDetails, products: updatedProducts });
      calculateTotal(updatedProducts);
    }
  };

  const handleContinue = () => {
    if (saleDetails.products.some(p => !p.sku || !p.name)) {
      alert('Please add at least one valid product');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await SalesService.createSale(saleDetails);
      await printReceipt(response);
      
      setSaleDetails({
        products: [{ sku: "", quantitySold: 1 }],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
      });
      setStep(1);
      setTotalAmount(0);

      alert("Sale recorded successfully!");
    } catch (error) {
      console.error("Error recording sale:", error);
      alert(error instanceof Error ? error.message : "Failed to record the sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell Products</h1>
      
      {step === 1 ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <button
              type="button"
              onClick={toggleEntryMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isManualEntry 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isManualEntry ? (
                <>
                  <Barcode size={20} />
                  Switch to Scanner Mode
                </>
              ) : (
                <>
                  <PenLine size={20} />
                  Switch to Manual Entry
                </>
              )}
            </button>
            <div className="text-xl font-bold">
              Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saleDetails.products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        id={`sku-${index}`}
                        name="sku"
                        ref={index === saleDetails.products.length - 1 ? skuInputRef : null}
                        value={product.sku}
                        // onChange={(e) => handleInputChange(e, index, "products")}
                        // onBlur={() => handleSkuBlur(index)}
                        className="border border-gray-300 rounded-md p-2"
                        // readOnly={!isManualEntry && isScanning}
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{product.sellingPrice?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="quantitySold"
                        value={product.quantitySold}
                        onChange={(e) => handleInputChange(e, index, "products")}
                        className="border border-gray-300 rounded-md p-2 w-20"
                        min="1"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{product.totalAmount?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {saleDetails.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={addProductField}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <Plus size={20} />
              Add Another Product
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={saleDetails.paymentMethod}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="customerName">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={saleDetails.customerName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="customerContact">
                Customer Contact
              </label>
              <input
                type="text"
                id="customerContact"
                name="customerContact"
                value={saleDetails.customerContact}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Products
            </button>

            <div className="text-xl font-bold">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-md ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              <Printer size={20} />
              {isSubmitting ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Selladd;