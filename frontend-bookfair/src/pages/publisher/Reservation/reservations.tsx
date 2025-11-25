import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { api } from "../../../lib/api";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/common/Button";

type Reservation = {
  bookFairName: string;
  hallName: string;
  stallName: string;
  stallSize: string;
  price: number;
  stallAllocationStatus: string;
};

const statusClass = (status?: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "CANCELLED":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const ReservationsPage: React.FC = () => {
  const { userId } = useAppSelector((s) => s.auth);
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    api
      .get(`/api/stall-reservation/user/${userId}`)
      .then((res) => {
        const data = res.data?.data || [];
        setRows(data);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load reservations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, [userId]);

  return (
    <div className="p-6 md:p-10 space-y-6 font-[Calibri]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your reservations</p>
          <h1 className="text-3xl font-bold text-foreground">Stall Reservations</h1>
        </div>
        <Button variant="outline" onClick={fetchReservations}>
          Refresh
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-900 text-white">
              <tr>
                {["Book Fair", "Hall", "Stall Name", "Size", "Price", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-rose-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No reservations yet.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{r.bookFairName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.hallName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.stallName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 uppercase">{r.stallSize}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">Rs {r.price}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(r.stallAllocationStatus)}`}>
                        {r.stallAllocationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReservationsPage;
