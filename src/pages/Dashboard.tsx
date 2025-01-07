import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import { Package, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          {/* Activity list will be populated from API */}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Check-ins</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          {/* Pending check-ins will be populated from API */}
        </div>
      </div>
    </div>
  );
}