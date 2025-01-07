import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PurchaseService from '../services/purchase.service';

interface Purchase {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  supplierId: {
    _id: string;
    name: string;
  };
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  purchaseDate: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await PurchaseService.getAllPurchases(); // Fetch all purchase orders from API
        setPurchases(data);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          New Purchase Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Purchases</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ₹{purchases.reduce((total, purchase) => total + purchase.totalCost, 0).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Last 30 days</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.supplierId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.productId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.purchaseDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
