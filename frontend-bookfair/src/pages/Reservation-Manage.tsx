
import React, { useEffect, useState } from "react";

interface Reservation {
  reservation_id: number;
  publisher_id: number;
  publisher: string;
  email: string;
  stall_id: number;
  stall_name: string;
  size: string;
  reservation_date: string;
}

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSize, setFilterSize] = useState("");

  const API = "http://localhost:5000/api/reservations";

  useEffect(() => {
    setLoading(true);
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm("Cancel this reservation?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Cancel failed");
      // remove locally
      setReservations((prev) => prev.filter((r) => r.reservation_id !== id));
      alert("Reservation canceled");
    } catch (err) {
      alert("Failed to cancel");
      console.error(err);
    }
  };

  const filtered = reservations.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (r.publisher?.toLowerCase().includes(searchLower) ?? false) ||
      (r.email?.toLowerCase().includes(searchLower) ?? false) ||
      (r.stall_name?.toLowerCase().includes(searchLower) ?? false);
    const matchesFilter = filterSize ? r.size === filterSize : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

 return (
  // Main Container: Clean padding, use a slightly off-white background for depth
  <div className="p-8 bg-gray-50 min-h-screen">
    
    {/* Header Section */}
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      Manage Stall Reservations
    </h2>

    {/* Filter and Search Section: Modern flex layout with rounded corners and shadows */}
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <input
        className="flex-grow border-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-lg transition duration-150 shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by publisher, email, or stall name..."
      />
      <select
        className="border-2 border-gray-300 p-3 rounded-lg appearance-none bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 cursor-pointer"
        value={filterSize}
        onChange={(e) => setFilterSize(e.target.value)}
      >
        <option value="">Filter by Size (All)</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>
    </div>

    {/* Table Container: Elevated card with rounded edges and soft shadow */}
    <div className="overflow-hidden bg-white rounded-xl shadow-2xl">
      <div className="overflow-x-auto"> {/* Ensures horizontal scrolling on small screens */}
        <table className="min-w-full divide-y divide-gray-200">
          
          {/* Table Header: Darker background for better contrast */}
          <thead className="bg-indigo-900 text-white ">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Publisher</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stall</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filtered.map((r, index) => (
              <tr 
                key={r.reservation_id} 
                className={`transition duration-150 ease-in-out hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} // Stripe effect
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.reservation_id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.publisher}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">{r.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.stall_name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {/* Styled Size Tag */}
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${r.size === 'Large' ? 'bg-red-100 text-red-800' : 
                      r.size === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`
                  }>
                    {r.size}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(r.reservation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    className="inline-flex items-center bg-indigo-800 text-white px-3 py-1.5 text-xs rounded-lg transition duration-150 hover:bg-indigo-700 shadow-md mr-2"
                    onClick={() => alert(`Open publisher profile for ${r.publisher}`)}
                  >
                    {/* Placeholder icon */}
                    View
                  </button>
                  <button
                    className="inline-flex items-center bg-red-600 text-white px-3 py-1.5 text-xs rounded-lg transition duration-150 hover:bg-red-700 shadow-md"
                    onClick={() => handleCancel(r.reservation_id)}
                  >
                    {/* Placeholder icon */}
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Empty State */}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-lg">
                  <span className="text-xl mr-2">😔</span> No reservations match the current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default Reservations;
