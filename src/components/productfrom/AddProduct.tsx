
// import React, { useState, useEffect } from "react";
// import ProductService from "../../services/Product.service";
// import { getAllCategories } from "../../services/Category.service";
// import SupplierService from '../../services/Supplier.service';

// type Product = {
//   name: string;
//   description: string;
//   category: string;
//   price: number;
//   purchasePrice: number;
//   sellingPrice: number;
//   quantity: number;
//   supplier: string;
//   sku: string;
//   manufacturingDate: string;
//   expiryDate: string;
//   weight: number;
// };

// const AddProduct: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([
//     {
//       name: "",
//       description: "",
//       category: "",
//       price: 0,
//       purchasePrice: 0,
//       sellingPrice: 0,
//       quantity: 0,
//       supplier: "",
//       sku: "",
//       manufacturingDate: "",
//       expiryDate: "",
//       weight: 0,
//     },
//   ]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [suppliers, setSuppliers] = useState<[]>([]);

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const data = await SupplierService.getAllSuppliers(); // Make sure this function is implemented in your service
//         setSuppliers(data);
//       } catch (error) {
//         console.error('Failed to fetch suppliers:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSuppliers();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         setCategories(data.map((category: { name: string }) => category.name));
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const createEmptyProduct = (): Product => ({
//     name: "",
//     description: "",
//     category: "",
//     price: 0,
//     purchasePrice: 0,
//     sellingPrice: 0,
//     quantity: 0,
//     supplier: "",
//     sku: "",
//     manufacturingDate: "",
//     expiryDate: "",
//     weight: 0,
//   });

//   const handleChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     const updatedProducts = [...products];
//     updatedProducts[index][name as keyof Product] =
//       name.includes("Date") || name === "sku" ? value : parseValue(value, name);
//     setProducts(updatedProducts);
//   };

//   const parseValue = (value: string, name: string): string | number => {
//     if (
//       name === "price" ||
//       name === "purchasePrice" ||
//       name === "sellingPrice" ||
//       name === "quantity" ||
//       name === "weight"
//     ) {
//       return parseFloat(value) || 0;
//     }
//     return value;
//   };

//   const addProductField = () => {
//     setProducts([...products, createEmptyProduct()]);
//   };

//   const removeProductField = (index: number) => {
//     const updatedProducts = products.filter((_, i) => i !== index);
//     setProducts(updatedProducts);
//   };

//   const validateProducts = (): boolean => {
//     for (const product of products) {
//       if (product.price <= 0 || product.purchasePrice <= 0 || product.sellingPrice <= 0) {
//         alert("Price values must be greater than zero.");
//         return false;
//       }
//       if (product.quantity < 0) {
//         alert("Quantity cannot be negative.");
//         return false;
//       }
//       if (new Date(product.manufacturingDate) >= new Date(product.expiryDate)) {
//         alert("Manufacturing date must be earlier than expiry date.");
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateProducts()) return;

//     setIsLoading(true);
//     try {
//       await ProductService.addProduct(products);
//       alert("Products added successfully!");
//       setProducts([createEmptyProduct()]);
//     } catch (error) {
//       console.error("Error adding products:", error);
//       alert("An error occurred while adding products.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Add Multiple Products</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {products.map((product, index) => (
//           <div key={index} className="border border-gray-300 p-4 rounded-md">
//             <h2 className="font-medium text-lg mb-2">Product {index + 1}</h2>
//             {Object.keys(product).map((key) => (
//               <div key={key} className="flex flex-col mb-4">
//                 <label
//                   htmlFor={`${key}-${index}`}
//                   className="font-medium text-gray-700 capitalize"
//                 >
//                   {key.replace(/([A-Z])/g, " $1")}
//                 </label>
//                 {key === "category" ? (
//                   <select
//                     id={`${key}-${index}`}
//                     name={key}
//                     value={product[key as keyof Product] as string}
//                     onChange={(e) => handleChange(index, e)}
//                     className="border border-gray-300 rounded-md p-2"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((category, i) => (
//                       <option key={i} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     id={`${key}-${index}`}
//                     name={key}
//                     type={
//                       key.includes("Date")
//                         ? "date"
//                         : typeof product[key as keyof Product] === "number"
//                         ? "number"
//                         : "text"
//                     }
//                     value={product[key as keyof Product] as string | number}
//                     onChange={(e) => handleChange(index, e)}
//                     className="border border-gray-300 rounded-md p-2"
//                     required
//                   />
//                 )}
//               </div>
//             ))}
//             {products.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => removeProductField(index)}
//                 className="text-red-500 hover:underline"
//               >
//                 Remove Product
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addProductField}
//           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Add Another Product
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           disabled={isLoading}
//         >
//           {isLoading ? "Submitting..." : "Submit Products"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

import React, { useState, useEffect, useRef } from "react";
import ProductService from "../../services/Product.service";
import { getAllCategories } from "../../services/Category.service";
import SupplierService from '../../services/Supplier.service';
import { Printer, Barcode, PenLine, Plus, Trash2 } from 'lucide-react';

type Product = {
  name: string;
  description: string;
  category: string;
  price: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  email: string; // Changed from supplier to email
  sku: string;
  manufacturingDate: string;
  expiryDate: string;
  weight: number;
};

const AddProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanBuffer, setScanBuffer] = useState("");
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);

  function createEmptyProduct(): Product {
    return {
      name: "",
      description: "",
      category: "",
      price: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      email: "",
      sku: "",
      manufacturingDate: "",
      expiryDate: "",
      weight: 0,
    };
  }

  useEffect(() => {
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
          const scannedSku = scanBuffer.replace("Enter", "");
          const updatedProducts = [...products];
          updatedProducts[currentProductIndex].sku = scannedSku;
          setProducts(updatedProducts);
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
  }, [isScanning, scanBuffer, currentProductIndex, products]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await SupplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.map((category: { name: string }) => category.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchSuppliers();
    fetchCategories();
  }, []);

  const printReceipt = async (product: any) => {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x0483 }]
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const receiptData = [
        '\x1B\x40', // Initialize printer
        '\x1B\x61\x01', // Center alignment
        'Product Added Successfully\n',
        '-'.repeat(32) + '\n',
        `SKU: ${product.sku}\n`,
        `Name: ${product.name}\n`,
        `Category: ${product.category}\n`,
        '-'.repeat(32) + '\n',
        '\x1D\x68\x80', // Set QR code height
        '\x1D\x77\x08', // Set QR code width
        '\x1D\x6B\x49\x0C', // Print QR code
        product.sku, // QR code content
        '\x00', // QR code terminator
        '\n\n\n\n', // Feed lines
        '\x1D\x56\x41', // Cut paper
      ].join('');

      const encoder = new TextEncoder();
      const data = encoder.encode(receiptData);
      await device.transferOut(1, data);
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Failed to print receipt. Please check printer connection.');
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    if (name === "sku") return; // Prevent manual SKU entry
    
    updatedProducts[index][name as keyof Product] =
      name.includes("Date") ? value : parseValue(value, name);
    setProducts(updatedProducts);
  };

  const parseValue = (value: string, name: string): string | number => {
    if (
      name === "price" ||
      name === "purchasePrice" ||
      name === "sellingPrice" ||
      name === "quantity" ||
      name === "weight"
    ) {
      return parseFloat(value) || 0;
    }
    return value;
  };

  const addProductField = () => {
    setProducts([...products, createEmptyProduct()]);
  };

  const removeProductField = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const validateProducts = (): boolean => {
    for (const product of products) {
      if (product.price <= 0 || product.purchasePrice <= 0 || product.sellingPrice <= 0) {
        alert("Price values must be greater than zero.");
        return false;
      }
      if (product.quantity < 0) {
        alert("Quantity cannot be negative.");
        return false;
      }
      if (new Date(product.manufacturingDate) >= new Date(product.expiryDate)) {
        alert("Manufacturing date must be earlier than expiry date.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProducts()) return;
  
    setIsLoading(true);
    try {
      const response = await ProductService.addProduct(products);
      
      // Print QR codes for each product
      for (const product of response.products) {
        await printReceipt(product);
      }
      
      alert("Products added successfully!");
      setProducts([createEmptyProduct()]);
    } catch (error) {
      console.error("Error adding products:", error);
      alert("An error occurred while adding products.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Multiple Products</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {products.map((product, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-lg">Product {index + 1}</h2>
              {isScanning && currentProductIndex === index && (
                <span className="text-blue-500">Scanning...</span>
              )}
            </div>

            {/* SKU Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                SKU {isScanning && currentProductIndex === index && "(Scanning...)"}
              </label>
              <input
                type="text"
                value={product.sku}
                className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
                readOnly
                onClick={() => setCurrentProductIndex(index)}
                placeholder="Scan barcode or leave empty for auto-generation"
              />
            </div>

            {/* Other Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={product.name}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  name="email"
                  value={product.email}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.email}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add other fields similarly */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  name="description"
                  value={product.description}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                <input
                  name="purchasePrice"
                  type="number"
                  value={product.purchasePrice}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                <input
                  name="sellingPrice"
                  type="number"
                  value={product.sellingPrice}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
  <label
    htmlFor="manufacturingDate"
    className="block text-sm font-medium text-gray-700"
  >
    Manufacturing Date
  </label>
  <input
    type="date"
    id="manufacturingDate"
    name="manufacturingDate"
    className="border border-gray-300 rounded-md p-2 w-full"
    required
  />
</div>

<div className="mb-4">
  <label
    htmlFor="expiryDate"
    className="block text-sm font-medium text-gray-700"
  >
    Expiry Date (Optional)
  </label>
  <input
    type="date"
    id="expiryDate"
    name="expiryDate"
    className="border border-gray-300 rounded-md p-2 w-full"
  />
</div>


              {/* ... */}

            </div>

            {products.length > 1 && (
              <button
                type="button"
                onClick={() => removeProductField(index)}
                className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-2"
              >
                <Trash2 size={20} />
                Remove Product
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addProductField}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <Plus size={20} />
            Add Another Product
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            <Printer size={20} />
            {isLoading ? "Processing..." : "Submit & Print Labels"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;