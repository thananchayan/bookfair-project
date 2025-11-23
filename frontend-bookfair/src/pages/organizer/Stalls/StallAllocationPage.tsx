import React, { useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/common/Button";
import toast from "react-hot-toast";
import "./StallAllocationPage.css";

type StallSize = "SMALL" | "MEDIUM" | "LARGE";
type StallStatus = "available" | "held" | "processing" | "booked";

type Stall = {
  id: string;
  hall: string;
  size: StallSize;
  status: StallStatus;
  publisher?: string | null;
};

type ReservationStatus = "pending" | "allocated";

type Reservation = {
  id: string;
  publisher: string;
  requestedSize: StallSize;
  preferredHall?: string;
  status: ReservationStatus;
};

const seedStalls: Stall[] = [
  { id: "T-01", hall: "H1", size: "LARGE", status: "available" },
  { id: "T-02", hall: "H1", size: "LARGE", status: "available" },
  { id: "T-03", hall: "H1", size: "LARGE", status: "booked", publisher: "Sunrise Publications" },
  { id: "L-01", hall: "H2", size: "MEDIUM", status: "available" },
  { id: "L-02", hall: "H2", size: "MEDIUM", status: "held" },
  { id: "R-01", hall: "H3", size: "MEDIUM", status: "available" },
  { id: "R-02", hall: "H3", size: "MEDIUM", status: "booked", publisher: "PageTurner Books" },
  { id: "I-01", hall: "H4", size: "SMALL", status: "available" },
  { id: "I-02", hall: "H4", size: "SMALL", status: "processing" },
];

const seedReservations: Reservation[] = [
  {
    id: "REQ-1001",
    publisher: "Sunrise Publications",
    requestedSize: "LARGE",
    preferredHall: "H1",
    status: "pending",
  },
  {
    id: "REQ-1002",
    publisher: "Lake House Press",
    requestedSize: "MEDIUM",
    preferredHall: "H2",
    status: "pending",
  },
  {
    id: "REQ-1003",
    publisher: "PageTurner Books",
    requestedSize: "SMALL",
    preferredHall: "H4",
    status: "pending",
  },
  {
    id: "REQ-1004",
    publisher: "City Lights",
    requestedSize: "MEDIUM",
    preferredHall: "H3",
    status: "allocated",
  },
];

const sizeLabel = (size: StallSize) => {
  switch (size) {
    case "SMALL":
      return "Small";
    case "MEDIUM":
      return "Medium";
    case "LARGE":
      return "Large";
    default:
      return size;
  }
};

const statusLabel: Record<StallStatus, string> = {
  available: "Available",
  held: "Held",
  processing: "Processing",
  booked: "Booked",
};

const OrganizerStallAllocationPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>(seedStalls);
  const [reservations, setReservations] = useState<Reservation[]>(seedReservations);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(
    seedReservations.find((r) => r.status === "pending")?.id ?? null
  );
  const [statusFilter, setStatusFilter] = useState<StallStatus | "all">("all");
  const [hallFilter, setHallFilter] = useState<string | "all">("all");
  const [sizeFilter, setSizeFilter] = useState<StallSize | "all">("all");

  const selectedReservation = reservations.find((r) => r.id === selectedReservationId) ?? null;

  const counts = useMemo(() => {
    const total = stalls.length;
    const available = stalls.filter((s) => s.status === "available").length;
    const held = stalls.filter((s) => s.status === "held").length;
    const booked = stalls.filter((s) => s.status === "booked").length;
    return { total, available, held, booked };
  }, [stalls]);

  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const allocatedReservations = reservations.filter((r) => r.status === "allocated");

  const halls = useMemo(
    () => Array.from(new Set(stalls.map((s) => s.hall))).sort(),
    [stalls]
  );

  const filteredStalls = useMemo(
    () =>
      stalls.filter((st) => {
        if (statusFilter !== "all" && st.status !== statusFilter) return false;
        if (hallFilter !== "all" && st.hall !== hallFilter) return false;
        if (sizeFilter !== "all" && st.size !== sizeFilter) return false;
        return true;
      }),
    [stalls, statusFilter, hallFilter, sizeFilter]
  );

  const handleAllocate = (stallId: string) => {
    if (!selectedReservation) return;
    setStalls((prev) =>
      prev.map((s) =>
        s.id === stallId
          ? { ...s, status: "booked", publisher: selectedReservation.publisher }
          : s
      )
    );
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id ? { ...r, status: "allocated" } : r
      )
    );
    toast.success(`Allocated ${stallId} to ${selectedReservation.publisher}`, {
      duration: 3000,
    });

    const nextPending = pendingReservations.find((r) => r.id !== selectedReservation.id);
    setSelectedReservationId(nextPending?.id ?? null);
  };

  const handleClearAllocation = (stallId: string) => {
    const stall = stalls.find((s) => s.id === stallId);
    setStalls((prev) =>
      prev.map((s) =>
        s.id === stallId ? { ...s, status: "available", publisher: null } : s
      )
    );
    if (stall?.publisher) {
      setReservations((prev) =>
        prev.map((r) =>
          r.publisher === stall.publisher && r.status === "allocated"
            ? { ...r, status: "pending" }
            : r
        )
      );
    }
    toast.success(`Cleared allocation for ${stallId}`, { duration: 2500 });
  };

  const isRecommended = (st: Stall) => {
    if (!selectedReservation) return false;
    if (st.status !== "available") return false;
    const hallMatch =
      !selectedReservation.preferredHall || st.hall === selectedReservation.preferredHall;
    const sizeMatch = st.size === selectedReservation.requestedSize;
    return hallMatch && sizeMatch;
  };

  return (
    <div className="stall-allocation-root space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Stall allocation</h1>
        <p className="text-sm text-gray-600 max-w-2xl">
          Review publisher requests, filter available stalls by hall and size, and allocate
          confirmed stalls for the Colombo Book Fair.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stall-allocation-kpi-card bg-white">
          <h3 className="stall-allocation-kpi-card__label text-gray-500">
            Total stalls
          </h3>
          <p className="stall-allocation-kpi-card__value font-bold text-gray-900 mt-2">
            {counts.total}
          </p>
          <p className="text-xs text-gray-500 mt-1">Across all halls and sizes</p>
        </Card>
        <Card className="stall-allocation-kpi-card bg-white">
          <h3 className="stall-allocation-kpi-card__label text-green-600">
            Available
          </h3>
          <p className="stall-allocation-kpi-card__value font-bold text-green-700 mt-2">
            {counts.available}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ready to allocate</p>
        </Card>
        <Card className="stall-allocation-kpi-card bg-white">
          <h3 className="stall-allocation-kpi-card__label text-amber-600">
            On hold
          </h3>
          <p className="stall-allocation-kpi-card__value font-bold text-amber-700 mt-2">
            {counts.held}
          </p>
          <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
        </Card>
        <Card className="stall-allocation-kpi-card bg-white">
          <h3 className="stall-allocation-kpi-card__label text-indigo-600">
            Allocated
          </h3>
          <p className="stall-allocation-kpi-card__value font-bold text-indigo-700 mt-2">
            {counts.booked}
          </p>
          <p className="text-xs text-gray-500 mt-1">Stalls already assigned</p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <Card className="stall-allocation-panel bg-white h-full">
          <div className="stall-allocation-panel__header mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Publisher reservations</h2>
            <span className="text-xs text-gray-500">
              Pending:{" "}
              <span className="font-semibold text-gray-800">
                {pendingReservations.length}
              </span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Pending requests
              </h3>
              {pendingReservations.length === 0 ? (
                <p className="stall-allocation-empty text-xs text-gray-500">
                  No pending requests at the moment.
                </p>
              ) : (
                <ul className="stall-allocation-pending-list space-y-2">
                  {pendingReservations.map((r) => {
                    const active = r.id === selectedReservationId;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedReservationId(r.id)}
                          className={[
                            "stall-allocation-pending-item",
                            active && "stall-allocation-pending-item--active",
                            "w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors",
                            active
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/60",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {r.publisher}
                            </span>
                            <span className="text-[11px] uppercase tracking-wide text-gray-500">
                              {r.id}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                            <span>
                              Size:{" "}
                              <span className="font-medium">
                                {sizeLabel(r.requestedSize)}
                              </span>
                            </span>
                            {r.preferredHall && (
                              <span>
                                Preferred hall:{" "}
                                <span className="font-medium">
                                  {r.preferredHall}
                                </span>
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {allocatedReservations.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Recently allocated
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                  {allocatedReservations.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5"
                    >
                      <span className="truncate">
                        {r.publisher} &mdash; {r.id}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-green-700">
                        Allocated
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        <Card className="stall-allocation-panel bg-white h-full">
          <div className="stall-allocation-panel__header flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Stalls overview</h2>
              <p className="text-xs text-gray-500">
                Filter and assign stalls. Recommended matches are highlighted.
              </p>
            </div>
            <div className="stall-allocation-filters flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StallStatus | "all")
                }
                className="h-9 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="held">Held</option>
                <option value="processing">Processing</option>
                <option value="booked">Allocated</option>
              </select>
              <select
                value={hallFilter}
                onChange={(e) =>
                  setHallFilter(e.target.value === "all" ? "all" : e.target.value)
                }
                className="h-9 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All halls</option>
                {halls.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <select
                value={sizeFilter}
                onChange={(e) =>
                  setSizeFilter(e.target.value as StallSize | "all")
                }
                className="h-9 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All sizes</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>
          </div>

          <div className="stall-allocation-table-wrap border border-gray-100 rounded-lg overflow-hidden">
            <table className="stall-allocation-table min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stall
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Hall
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Size
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Publisher
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStalls.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="stall-allocation-empty px-3 py-6 text-center text-xs text-gray-500"
                    >
                      No stalls match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStalls.map((st) => {
                    const recommended = isRecommended(st);
                    return (
                      <tr
                        key={st.id}
                        className={
                          recommended
                            ? "stall-allocation-row--recommended transition-colors"
                            : "hover:bg-gray-50 transition-colors"
                        }
                      >
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                          {st.id}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                          {st.hall}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                          {sizeLabel(st.size)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={[
                              "stall-allocation-status-pill",
                              st.status === "available" &&
                                "stall-allocation-status-pill--available",
                              st.status === "held" &&
                                "stall-allocation-status-pill--held",
                              st.status === "processing" &&
                                "stall-allocation-status-pill--processing",
                              st.status === "booked" &&
                                "stall-allocation-status-pill--booked",
                            ].filter(Boolean).join(" ")}
                          >
                            {statusLabel[st.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                          {st.publisher ?? <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right">
                          {st.status === "available" && selectedReservation ? (
                            <Button
                              variant="outline"
                              className="h-8 px-3 text-xs"
                              onClick={() => handleAllocate(st.id)}
                            >
                              Allocate to {selectedReservation.publisher}
                            </Button>
                          ) : st.status === "booked" ? (
                            <Button
                              variant="secondary"
                              className="h-8 px-3 text-xs"
                              onClick={() => handleClearAllocation(st.id)}
                            >
                              Clear
                            </Button>
                          ) : (
                            <span className="text-[11px] text-gray-400">
                              {selectedReservation
                                ? "Not allocable"
                                : "Select a request first"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default OrganizerStallAllocationPage;
