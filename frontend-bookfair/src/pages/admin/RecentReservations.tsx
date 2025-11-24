import React, { useEffect, useState } from "react";

type ReservationStatus = "pending" | "approved";

interface Reservation {
  id: number;
  publisher: string;
  email: string;
  stallCode: string;
  hall: string;
  size: "Small" | "Medium" | "Large";
  reservedAt: string;
  status: ReservationStatus;
}

const seedReservations: Reservation[] = [
  {
    id: 1001,
    publisher: "Sunrise Publications",
    email: "contact@sunrisepub.com",
    stallCode: "T-03",
    hall: "H1",
    size: "Large",
    reservedAt: "2025-02-05T10:30:00Z",
    status: "pending",
  },
  {
    id: 1002,
    publisher: "Lake House Press",
    email: "info@lakehouse.lk",
    stallCode: "L-02",
    hall: "H2",
    size: "Medium",
    reservedAt: "2025-02-06T14:15:00Z",
    status: "approved",
  },
  {
    id: 1003,
    publisher: "PageTurner Books",
    email: "hello@pageturner.com",
    stallCode: "I-01",
    hall: "H4",
    size: "Small",
    reservedAt: "2025-02-07T09:50:00Z",
    status: "pending",
  },
];

const RecentReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // For now we load static demo data.
    // Later you can replace this with a real API call that
    // returns bookings created from the publisher BookingInterface.
    setReservations(seedReservations);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-2">Recent Stall Bookings</h3>
      <p className="text-xs text-gray-500 mb-4">
        Read-only view of stalls reserved by publishers via the stall booking interface.
      </p>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-sm">No reservations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-t border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Publisher
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stall
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Hall
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Size
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{r.publisher}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-sm text-gray-800">
                    {r.stallCode}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">{r.hall}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        r.size === "Large" && "bg-red-100 text-red-800",
                        r.size === "Medium" && "bg-yellow-100 text-yellow-800",
                        r.size === "Small" && "bg-green-100 text-green-800",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {r.size}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    {new Date(r.reservedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        r.status === "approved"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-amber-100 text-amber-800",
                      ].join(" ")}
                    >
                      {r.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentReservations;

