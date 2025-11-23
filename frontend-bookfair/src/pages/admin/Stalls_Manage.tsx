import React, { useEffect, useState } from "react";

interface Stall {
  id: string | number;
  stall_name: string;
  size: string;
  status: string;
}

const CreateStalls = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Dummy data (Replace API data)
  const dummyStalls: Stall[] = [
    { id: 1, stall_name: "A1", size: "Small", status: "Available" },
    { id: 2, stall_name: "A2", size: "Medium", status: "Reserved" },
    { id: 3, stall_name: "B1", size: "Large", status: "Maintenance" },
  ];

  useEffect(() => {
    setLoading(true);

    // Simulate loading while removing actual backend call
    setTimeout(() => {
      setStalls(dummyStalls);
      setLoading(false);
    }, 300);
  }, []);

  const handleDelete = (id: string | number) => {
    if (!window.confirm("Delete this stall?")) return;

    setStalls((prev) => prev.filter((s) => s.id !== id));
    alert("Deleted (local only, no backend)");
  };

  if (loading) return <div className="p-4">Loading stalls...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Manage Exhibition Stalls
      </h2>

      <div className="overflow-hidden bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-900 text-white">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stall Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {stalls.map((s, index) => (
                <tr
                  key={s.id}
                  className={`transition duration-150 ease-in-out hover:bg-teal-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.id}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{s.stall_name}</td>

                  <td className="px-5 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        s.size === "Large"
                          ? "bg-pink-100 text-pink-800"
                          : s.size === "Medium"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {s.size}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        s.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : s.status === "Reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className="inline-flex items-center bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 hover:bg-indigo-700 shadow-md mr-3"
                      onClick={() => alert(`Edit ${s.stall_name} (not implemented)`)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="inline-flex items-center bg-red-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 hover:bg-red-700 shadow-md"
                      onClick={() => handleDelete(s.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}

              {stalls.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-500 text-lg">
                    <span className="text-xl mr-2"></span> No stalls have been configured yet.
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

export default CreateStalls;
