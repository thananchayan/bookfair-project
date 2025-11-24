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
  const [search, setSearch] = useState("");
  const [filterSize, setFilterSize] = useState("");

  // --- Dummy static data (No backend integration) ---
  useEffect(() => {
    const dummyData: Reservation[] = [
      {
        reservation_id: 1,
        publisher_id: 11,
        publisher: "New Light Publishers",
        email: "info@newlight.com",
        stall_id: 101,
        stall_name: "Stall A1",
        size: "Small",
        reservation_date: "2024-02-05T10:30:00",
      },
      {
        reservation_id: 2,
        publisher_id: 22,
        publisher: "Silver Star Books",
        email: "contact@silverstar.com",
        stall_id: 102,
        stall_name: "Stall B3",
        size: "Medium",
        reservation_date: "2024-02-06T14:10:00",
      },
      {
        reservation_id: 3,
        publisher_id: 33,
        publisher: "Golden Reads",
        email: "hello@goldenreads.com",
        stall_id: 103,
        stall_name: "Stall C2",
        size: "Large",
        reservation_date: "2024-02-07T09:50:00",
      },
    ];

    setReservations(dummyData);
    setLoading(false);
  }, []);

  const handleCancel = (id: number) => {
    const confirmed = window.confirm("Cancel this reservation?");
    if (!confirmed) return;

    // remove locally
    setReservations((prev) =>
      prev.filter((r) => r.reservation_id !== id)
    );
    alert("Reservation canceled (dummy)");
  };

  const filtered = reservations.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      r.publisher.toLowerCase().includes(searchLower) ||
      r.email.toLowerCase().includes(searchLower) ||
      r.stall_name.toLowerCase().includes(searchLower);

    const matchesFilter = filterSize ? r.size === filterSize : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Manage Stall Reservations
      </h2>

      {/* Search & Filter */}
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

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-indigo-900 text-white">
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

            <tbody className="divide-y divide-gray-200">
              {filtered.map((r, index) => (
                <tr key={r.reservation_id}
                  className={`transition duration-150 ease-in-out hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium">{r.reservation_id}</td>
                  <td className="px-4 py-3 text-sm">{r.publisher}</td>
                  <td className="px-4 py-3 text-sm text-indigo-600">{r.email}</td>
                  <td className="px-4 py-3 text-sm">{r.stall_name}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        r.size === "Large"
                          ? "bg-red-100 text-red-800"
                          : r.size === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.size}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(r.reservation_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-indigo-800 text-white px-3 py-1.5 text-xs rounded-lg mr-2 hover:bg-indigo-700"
                      onClick={() => alert(`Open publisher profile for ${r.publisher}`)}
                    >
                      View
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-red-700"
                      onClick={() => handleCancel(r.reservation_id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-lg">
                    No reservations match the current criteria.
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
