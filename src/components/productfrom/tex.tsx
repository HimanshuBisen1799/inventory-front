import React, { useState, useEffect } from "react";
import ProductService from "../../services/Product.service";
import { getAllCategories } from "../../services/Category.service";

type Product = {
  name: string;
  description: string;
  category: string;
  price: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: string;
  sku: string;
  manufacturingDate: string;
  expiryDate: string;
  weight: number;
};

const AddProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      name: "",
      description: "",
      category: "",
      price: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      supplier: "",
      sku: "",
      manufacturingDate: "",
      expiryDate: "",
      weight: 0,
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.map((category: { name: string }) => category.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const createEmptyProduct = (): Product => ({
    name: "",
    description: "",
    category: "",
    price: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    supplier: "",
    sku: "",
    manufacturingDate: "",
    expiryDate: "",
    weight: 0,
  });

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name as keyof Product] =
      name.includes("Date") || name === "sku" ? value : parseValue(value, name);
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
      await ProductService.addProduct(products);
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
            <h2 className="font-medium text-lg mb-2">Product {index + 1}</h2>
            {Object.keys(product).map((key) => (
              <div key={key} className="flex flex-col mb-4">
                <label
                  htmlFor={${key}-${index}}
                  className="font-medium text-gray-700 capitalize"
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {key === "category" ? (
                  <select
                    id={${key}-${index}}
                    name={key}
                    value={product[key as keyof Product] as string}
                    onChange={(e) => handleChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={${key}-${index}}
                    name={key}
                    type={
                      key.includes("Date")
                        ? "date"
                        : typeof product[key as keyof Product] === "number"
                        ? "number"
                        : "text"
                    }
                    value={product[key as keyof Product] as string | number}
                    onChange={(e) => handleChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  />
                )}
              </div>
            ))}
            {products.length > 1 && (
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Products"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;