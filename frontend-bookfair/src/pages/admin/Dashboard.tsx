import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DashboardData {
  totalRevenue: number;
  stallsBooked: number;
  totalStalls: number;
  activeVendors: number;
  newVendorsThisWeek: number;
  upcomingFairs: number;
  nextFairName: string;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const dummy: DashboardData = {
      totalRevenue: 45231.89,
      stallsBooked: 345,
      totalStalls: 500,
      activeVendors: 128,
      newVendorsThisWeek: 12,
      upcomingFairs: 3,
      nextFairName: "Summer Book Fest",
    };

    setData(dummy);
  }, []);

  if (!data) {
    return <div className="p-6 text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Dashboard Overview</h2>
      <p className="text-gray-500 mb-8">
        Real-time insights and performance metrics for the BookFair Reservation System.
      </p>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Stalls Booked</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            {data.stallsBooked}/{data.totalStalls}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((data.stallsBooked / data.totalStalls) * 100)}% total occupancy
          </p>
        </div>

       
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Active Vendors</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            +{data.activeVendors}
          </h3>
          <p className="text-green-600 text-xs mt-1">
            +{data.newVendorsThisWeek} new this week
          </p>
        </div>

 
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Upcoming Fairs</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            {data.upcomingFairs}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Next: {data.nextFairName}
          </p>
        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        


        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow h-72">
          <h3 className="text-lg font-bold mb-3 text-gray-900">Stall Occupancy by Hall</h3>
          <p className="text-gray-500 text-sm">
            Current booking status across different halls.
          </p>
          <div className="mt-6 w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
