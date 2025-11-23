import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import RecentReservations from "./RecentReservations";
import { Link } from "react-router-dom";

interface DashboardData {
  totalStalls: number;
  reservedStalls: number;
  percentageBooked: number;
  registeredPublishers: number;
  availableBySize: {
    small: number;
    medium: number;
    large: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);


  useEffect(() => {
    const dummyData: DashboardData = {
      totalStalls: 150,
      reservedStalls: 90,
      percentageBooked: 60,
      registeredPublishers: 42,
      availableBySize: {
        small: 20,
        medium: 30,
        large: 10,
      },
    };

    setData(dummyData);
  }, []);

  if (!data) {
    return <div className="p-6 text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Stalls Reserved"
          value={`${data.reservedStalls} / ${data.totalStalls}`}
        />
        <StatCard title="Percentage Booked" value={`${data.percentageBooked}%`} />
        <StatCard title="Total Registered Publishers" value={data.registeredPublishers} />
        <StatCard
          title="Available Stalls"
          value={`S: ${data.availableBySize.small}, M: ${data.availableBySize.medium}, L: ${data.availableBySize.large}`}
        />
      </div>

      {/* --- Recent Reservations --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReservations />
        </div>

   
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/admin/stalls" className="text-blue-600 hover:underline">Manage Stalls</Link></li>
            <li><Link to="/admin/reservations" className="text-blue-600 hover:underline">View All Reservations</Link></li>
            <li><Link to="/admin/publishers" className="text-blue-600 hover:underline">Manage Publishers</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
