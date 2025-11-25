import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface BookFairResponse {
  data?: any[];
}

const AdminDashboard: React.FC = () => {
  const [upcomingCount, setUpcomingCount] = useState<number | null>(null);
  const [ongoingCount, setOngoingCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    Promise.all([
      api.get<BookFairResponse>("http://localhost:8087/api/bookfairs/getUpcoming"),
      api.get<BookFairResponse>("http://localhost:8087/api/bookfairs/getOngoing"),
      api.get<BookFairResponse>("http://localhost:8087/api/bookfairs/getAll"),
    ])
      .then(([upcomingRes, ongoingRes, totalRes]) => {
        setUpcomingCount(upcomingRes.data?.data?.length ?? 0);
        setOngoingCount(ongoingRes.data?.data?.length ?? 0);
        setTotalCount(totalRes.data?.data?.length ?? 0);
      })
      .catch((err) => {
        const msg = err?.response?.data?.data || err?.response?.data?.message || err?.message || "Failed to load dashboard";
        setError(msg);
      });
  }, []);

  if (error) {
    return <div className="p-6 text-rose-600">{error}</div>;
  }

  if (upcomingCount === null || ongoingCount === null || totalCount === null) {
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
          <p className="text-gray-500 text-sm">Upcoming Bookfairs</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            {upcomingCount}
          </h3>

        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Ongoing Bookfairs</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            {ongoingCount}
          </h3>

        </div>


        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Total Bookfairs</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            {totalCount}
          </h3>

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
