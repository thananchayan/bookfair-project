import React, { useEffect, useState } from "react";

interface Stall {
  id: string | number;
  stall_name: string;
  size: string;
  status: string;
}

const Stalls = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = "http://localhost:5000/api/stalls";

  useEffect(() => {
    setLoading(true);
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stalls");
        return res.json();
      })
      .then((data) => {
        setStalls(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this stall?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStalls((prev) => prev.filter((s) => s.id !== id));
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete stall");
    }
  };

  if (loading) return <div className="p-4">Loading stalls...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

return (
  // Main Container: Clean padding, use a slightly off-white background for depth
  <div className="p-8 bg-gray-50 min-h-screen">
    
    {/* Header Section */}
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      Manage Exhibition Stalls
    </h2>

    {/* Table Container: Elevated card with rounded edges and soft shadow */}
    <div className="overflow-hidden bg-white rounded-xl shadow-2xl border border-gray-100">
      <div className="overflow-x-auto"> {/* Ensures horizontal scrolling on small screens */}
        <table className="min-w-full divide-y divide-gray-200">
          
          {/* Table Header: Use a vibrant primary color (e.g., Teal) for emphasis */}
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stall Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {stalls.map((s, index) => (
              <tr 
                key={s.id} 
                className={`transition duration-150 ease-in-out hover:bg-teal-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} // Stripe effect
              >
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.id}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{s.stall_name}</td>
                
                {/* Styled Size Tag */}
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${s.size === 'Large' ? 'bg-pink-100 text-pink-800' : 
                      s.size === 'Medium' ? 'bg-indigo-100 text-indigo-800' : 
                      'bg-green-100 text-green-800'}`
                  }>
                    {s.size}
                  </span>
                </td>
                
                {/* Styled Status Tag */}
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${s.status === 'Available' ? 'bg-green-100 text-green-800' : 
                      s.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`
                  }>
                    {s.status}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    className="inline-flex items-center bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 hover:bg-indigo-700 shadow-md mr-3"
                    onClick={() => alert(`Edit ${s.stall_name} (not implemented)`)}
                  >
                    {/* Placeholder icon */}
                    ✏️ Edit
                  </button>
                  <button
                    className="inline-flex items-center bg-red-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 hover:bg-red-700 shadow-md"
                    onClick={() => handleDelete(s.id)}
                  >
                    {/* Placeholder icon */}
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Empty State */}
            {stalls.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500 text-lg">
                  <span className="text-xl mr-2">😔</span> No stalls have been configured yet.
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

export default Stalls;
