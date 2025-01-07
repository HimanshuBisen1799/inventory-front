import React, { useState } from "react";
import SalesService, { SaleProduct } from "../../services/Sales.service";

const Selladd: React.FC = () => {
  const [saleDetails, setSaleDetails] = useState({
    products: [
      {
        sku: "",
        quantitySold: 1,
      },
    ],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: "products"
  ) => {
    const { name, value } = e.target;
    if (field === "products" && index !== undefined) {
      const updatedProducts = [...saleDetails.products];
      updatedProducts[index][name as keyof SaleProduct] =
        name === "quantitySold" ? parseInt(value) : value;
      setSaleDetails({ ...saleDetails, products: updatedProducts });
    } else {
      setSaleDetails({ ...saleDetails, [name]: value });
    }
  };

  const addProductField = () => {
    setSaleDetails({
      ...saleDetails,
      products: [...saleDetails.products, { sku: "", quantitySold: 1 }],
    });
  };

  const removeProductField = (index: number) => {
    const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
    setSaleDetails({ ...saleDetails, products: updatedProducts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const salePayload = {
        products: saleDetails.products.map((product) => ({
          sku: product.sku,
          quantitySold: product.quantitySold,
          totalAmount: 0, // Set this appropriately if required by backend
          productId: "", // Replace with the actual productId if needed
        })),
        paymentMethod: saleDetails.paymentMethod,
        customerName: saleDetails.customerName,
        customerContact: saleDetails.customerContact,
        totalSaleAmount: 0, // Calculate the total if needed
      };

      const response = await SalesService.createSale(salePayload);
      alert("Sale recorded successfully!");
      console.log("Sale response:", response);

      // Reset the form
      setSaleDetails({
        products: [{ sku: "", quantitySold: 1 }],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
      });
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Failed to record the sale.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell Products</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {saleDetails.products.map((product, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Product {index + 1}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor={`sku-${index}`}>
                  SKU
                </label>
                <input
                  type="text"
                  id={`sku-${index}`}
                  name="sku"
                  value={product.sku}
                  onChange={(e) => handleInputChange(e, index, "products")}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor={`quantitySold-${index}`}
                >
                  Quantity Sold
                </label>
                <input
                  type="number"
                  id={`quantitySold-${index}`}
                  name="quantitySold"
                  value={product.quantitySold}
                  onChange={(e) => handleInputChange(e, index, "products")}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  min="1"
                  required
                />
              </div>
              {saleDetails.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProductField(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove Product
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProductField}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Another Product
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="paymentMethod">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={saleDetails.paymentMethod}
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
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
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
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
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit Sale
        </button>
      </form>
    </div>
  );
};

export default Selladd;
