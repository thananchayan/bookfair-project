import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { api } from "../../../lib/api";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

type BookFair = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  organizer: string;
  location: string;
  durationDays: number;
  description: string;
  status: string;
};

const UpcomingBookFairsPage: React.FC = () => {
  const { token, tokenType } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [rows, setRows] = useState<BookFair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingBookFairs = () => {
    setLoading(true);
    setError(null);
    api
      .get("/api/bookfairs/getUpcoming", {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      })
      .then((res) => {
        const data = res.data?.data || [];
        setRows(data);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load upcoming book fairs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUpcomingBookFairs();
  }, []);
  
  const handleReserve = (bookFairId: number) => {
    // Navigate to stall reservation page
    navigate("/publisher/reserve-stall", { state: { bookFairId } });
  };
//    const handleReserve = (bookFairId: number) => {
//     navigate(`/publisher/reserve-stall/${bookFairId}`);
//   };

  return (
    <div className="p-6 md:p-10 space-y-6 font-[Calibri]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Browse available</p>
          <h1 className="text-3xl font-bold text-foreground">Upcoming Book Fairs</h1>
        </div>
        <Button variant="outline" onClick={fetchUpcomingBookFairs}>
          Refresh
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-900 text-white">
              <tr>
                {["Name", "Start Date", "End Date", "Organizer", "Location", "Duration", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-rose-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No upcoming book fairs available.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.startDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.endDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.organizer}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.durationDays} day{r.durationDays !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleReserve(r.id)}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        Reserve Stall
                      </Button>
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

export default UpcomingBookFairsPage;
