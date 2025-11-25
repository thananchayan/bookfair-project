import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../store/hooks";
import { api } from "../../../lib/api";
import "./BookingInterface.css";

type StallSize = "SMALL" | "MEDIUM" | "LARGE";
type StallStatus = "available" | "held" | "processing" | "booked" | "approved" | "pending" | "blocked";

// Geometry types
interface RectStall {
  id: string;
  shape: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  size: StallSize;
  hallStallId: number;
  allocationId?: number;
  label: string;
  price?: number;
  serverStatus?: StallStatus;
}

interface ArcStall {
  id: string;
  shape: "arc";
  cx: number;
  cy: number;
  rInner: number;
  rOuter: number;
  startDeg: number;
  endDeg: number;
  size: StallSize;
  hallStallId: number;
  allocationId?: number;
  label: string;
  price?: number;
  serverStatus?: StallStatus;
}

type Stall = RectStall | ArcStall;

// API types
interface Hall {
  id: number;
  bookFairId: number;
  hallName: string;
  row: number;
  column: number;
  innerRing: number;
  outerRing: number;
  hallSize: number;
}

interface HallStall {
  id: number;
  bookFairId: number;
  stallName: string;
  hallId: number;
  hallName: string;
}

interface Allocation {
  id: number; // stallAllocationId
  bookFairId: number;
  hallStallID: number;
  stallId: number;
  price: number;
  stallAllocationStatus: string;
  userId: number | null;
  reservationToken: string | null;
}

interface AllocationEnvelope {
  data: Allocation[];
}

const d2r = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(d2r(deg)),
  y: cy + r * Math.sin(d2r(deg)),
});

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, start: number, end: number) {
  const large = end - start <= 180 ? 0 : 1;
  const p1 = polar(cx, cy, rOuter, start);
  const p2 = polar(cx, cy, rOuter, end);
  const p3 = polar(cx, cy, rInner, end);
  const p4 = polar(cx, cy, rInner, start);
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

const sizeLetter = (sz: StallSize) => (sz === "SMALL" ? "s" : sz === "MEDIUM" ? "m" : "l");

const mapServerStatus = (alloc?: Allocation): StallStatus => {
  if (!alloc) return "blocked";
  const status = (alloc.stallAllocationStatus || "").toUpperCase();
  if (status === "APPROVED") return "approved";
  if (status === "PENDING") return "pending";
  if (status === "PROCESSING") return "processing";
  if (alloc.userId) return "booked";
  return "available";
};

function rectPlacements(area: { x: number; y: number; w: number; h: number }, stalls: HallStall[]): RectStall[] {
  if (stalls.length === 0) return [];
  const cols = Math.min(stalls.length, 6);
  const rows = Math.ceil(stalls.length / cols);
  const gapX = 6;
  const gapY = 6;
  const innerW = area.w - gapX * (cols - 1);
  const innerH = area.h - gapY * (rows - 1);
  const cellW = innerW / cols;
  const cellH = innerH / rows;

  return stalls.map((st, idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const size: StallSize = idx % 3 === 0 ? "SMALL" : idx % 3 === 1 ? "MEDIUM" : "LARGE";
    return {
      id: st.stallName,
      label: st.stallName,
      hallStallId: st.id,
      shape: "rect",
      x: area.x + c * (cellW + gapX),
      y: area.y + r * (cellH + gapY),
      width: cellW,
      height: cellH,
      size,
    };
  });
}

function arcPlacements(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  count: number,
  stalls: HallStall[],
  prefix: string
): ArcStall[] {
  if (count === 0 || stalls.length === 0) return [];
  const startDeg = -90;
  const endDeg = 270;
  const sweep = (endDeg - startDeg) / count;
  const gapDeg = 1;
  const pad = gapDeg / 2;

  return Array.from({ length: Math.min(count, stalls.length) }, (_, i) => {
    const s = startDeg + i * sweep + pad;
    const e = s + sweep - gapDeg;
    const size: StallSize = i % 3 === 0 ? "SMALL" : i % 3 === 1 ? "MEDIUM" : "LARGE";
    const st = stalls[i];
    return {
      id: st.stallName,
      label: st.stallName,
      hallStallId: st.id,
      shape: "arc",
      cx,
      cy,
      rInner,
      rOuter,
      startDeg: s,
      endDeg: e,
      size,
    };
  });
}

function BookingSummary({
  items,
  onEdit,
  onConfirm,
}: {
  items: { id: string; size: StallSize; price: number }[];
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const subtotal = items.reduce((s, it) => s + it.price, 0);
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="summary-card">
      <div className="summary-header">
        <h3>Booking Summary</h3>
        <span className="summary-count">{items.length} selected</span>
      </div>
      <div className="summary-list">
        {items.map((it) => (
          <div className="summary-row" key={it.id}>
            <div className="summary-left">
              <div className="summary-title">
                <span className="id">{it.id}</span>
              </div>
              <div className="summary-sub">Size: <b>{it.size}</b></div>
            </div>
            <div className="summary-price">{fmt(it.price || 0)}</div>
          </div>
        ))}
      </div>
      <div className="summary-totals">
        <div><span>Subtotal</span><b>{fmt(subtotal)}</b></div>
        <div><span>VAT (15%)</span><b>{fmt(vat)}</b></div>
        <hr />
        <div className="grand"><span>Grand Total</span><b>{fmt(total)}</b></div>
      </div>
      <div className="summary-actions">
        <button className="btn ghost" onClick={onEdit}>Edit Selection</button>
        <button className="btn primary" onClick={onConfirm}>Confirm Booking</button>
      </div>
    </div>
  );
}

export default function BookingInterface() {
  const location = useLocation();
  const { userId } = useAppSelector((s) => s.auth);
  const bookFairId = location.state?.bookFairId || 1;

  const W = 1000, H = 600;
  const CX = W / 2, CY = H * 0.62;

  const INNER_R_INNER = 40;
  const INNER_R_OUTER = 100;
  const OUTER_R_INNER = 115;
  const OUTER_R_OUTER = 174;
  const CLEARANCE_TO_RING = 18;
  const TOP = { x: 170, y: 30, w: 660, h: 180 - CLEARANCE_TO_RING };
  const LEFT = { x: 45, y: 320, w: 260, h: 200 };
  const RIGHT = { x: 695, y: 320, w: 260, h: 200 };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hallData, setHallData] = useState<Hall[]>([]);
  const [hallStalls, setHallStalls] = useState<HallStall[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [approvedAllocations, setApprovedAllocations] = useState<Allocation[]>([]);
  const [status, setStatus] = useState<Record<string, StallStatus>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      api.get<Hall[]>(`http://localhost:8087/api/halls/bookfair/${bookFairId}`),
      api.get<HallStall[]>(`http://localhost:8087/api/hall-stalls/hallStalls/${bookFairId}`),
      api.get<AllocationEnvelope>(`http://localhost:8087/api/stall-reservation/bookfair/${bookFairId}`),
      api.get<AllocationEnvelope>(`http://localhost:8087/api/stall-allocations/bookfair/status/${bookFairId}?status=APPROVED`),
    ])
      .then(([hallsRes, hallStallsRes, allocRes, approvedRes]) => {
        setHallData(hallsRes.data || []);
        setHallStalls(hallStallsRes.data || []);
        setAllocations(allocRes.data?.data || []);
        setApprovedAllocations(approvedRes.data?.data || []);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.data ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load stall data"
        );
      })
      .finally(() => setLoading(false));
  }, [bookFairId]);

  const stalls = useMemo<Stall[]>(() => {
    if (!hallData.length || !hallStalls.length) return [];

    const allocByHallStall = new Map<number, Allocation>();
    // Approved should override other statuses
    approvedAllocations.forEach((a) => allocByHallStall.set(a.hallStallID, a));
    allocations.forEach((a) => {
      if (!allocByHallStall.has(a.hallStallID)) {
        allocByHallStall.set(a.hallStallID, a);
      }
    });

    const ringHall = hallData.find((h) => h.hallName.toUpperCase() === "RING");
    const topHallStalls = hallStalls.filter((s) => s.hallName.toUpperCase() === "TOP");
    const leftHallStalls = hallStalls.filter((s) => s.hallName.toUpperCase() === "LEFT");
    const rightHallStalls = hallStalls.filter((s) => s.hallName.toUpperCase() === "RIGHT");
    const ringStalls = hallStalls.filter((s) => s.hallName.toUpperCase() === "RING");

    const top = rectPlacements(TOP, topHallStalls);
    const left = rectPlacements(LEFT, leftHallStalls);
    const right = rectPlacements(RIGHT, rightHallStalls);

    const innerCount = ringHall?.innerRing || 0;
    const outerCount = ringHall?.outerRing || 0;
    const innerRing = arcPlacements(CX, CY, INNER_R_INNER, INNER_R_OUTER, innerCount, ringStalls, "IR");
    const outerRing = arcPlacements(CX, CY, OUTER_R_INNER, OUTER_R_OUTER, outerCount, ringStalls.slice(innerCount), "OR");

    const all = [...top, ...left, ...right, ...innerRing, ...outerRing];

    return all.map((s) => {
      const alloc = allocByHallStall.get(s.hallStallId);
      return {
        ...s,
        allocationId: alloc?.id,
        price: alloc?.price,
        serverStatus: mapServerStatus(alloc),
      } as Stall;
    });
  }, [hallData, hallStalls, allocations, approvedAllocations]);

  useEffect(() => {
    if (!stalls.length) return;
    const initial = Object.fromEntries(stalls.map((s) => [s.id, s.serverStatus || "available"]));
    setStatus(initial);
  }, [stalls]);

  const selectedIds = useMemo(() => Object.entries(status).filter(([, v]) => v === "held").map(([k]) => k), [status]);

  useEffect(() => {
    if (showSummary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showSummary]);

  const handleStallClick = (id: string) => {
    const stall = stalls.find((s) => s.id === id);
    if (!stall) return;
    const curr = status[id];
    // Blocked / Approved / processing / booked are locked
    if (curr === "blocked" || curr === "booked" || curr === "processing" || curr === "approved") return;
    if (curr === "held") {
      setStatus((prev) => ({ ...prev, [id]: "available" }));
      if (showSummary && selectedIds.length - 1 <= 0) setShowSummary(false);
      return;
    }
    if (curr === "available" || curr === "pending") {
      if (selectedIds.length >= 3) {
        toast.error("Maximum stall allocations are 3.");
        return;
      }
      setPendingId(id);
    }
  };

  const confirmSelect = () => {
    if (!pendingId) return;
    setStatus((prev) => ({ ...prev, [pendingId]: "held" }));
    setPendingId(null);
  };
  const cancelSelect = () => setPendingId(null);

  const onContinue = () => {
    if (selectedIds.length === 0) return;
    setShowSummary(true);
  };

  const summaryItems = () =>
    selectedIds.map((id) => {
      const s = stalls.find((x) => x.id === id)!;
      return { id: s.label, size: s.size, price: s.price ?? 0 };
    });

  const handleConfirmBooking = async () => {
    if (!userId) {
      toast.error("Please login again to book stalls.");
      return;
    }
    const selectedAllocations = selectedIds
      .map((id) => stalls.find((s) => s.id === id)?.allocationId)
      .filter(Boolean) as number[];
    if (!selectedAllocations.length) return;
    try {
      await api.post("http://localhost:8087/api/stall-reservation", {
        userId,
        stallAllocationId: selectedAllocations,
      });
      toast.success("Reservation submitted!");
      setShowSummary(false);
      setStatus((prev) => {
        const next = { ...prev };
        selectedIds.forEach((id) => (next[id] = "booked"));
        return next;
      });
    } catch (err: any) {
      const resMessage = err?.response?.data?.data || err?.response?.data?.message || err?.message;
      toast.error(resMessage || "Failed to reserve stalls");
    }
  };

  if (loading) {
    return (
      <div className="stall-wrap">
        <div className="p-6 text-center text-gray-600">
          <div className="animate-pulse">Loading stall map...</div>
        </div>
      </div>
    );
  }

  if (error || !stalls.length) {
    return (
      <div className="stall-wrap">
        <div className="p-6 text-center">
          <div className="text-rose-600 font-semibold mb-4">{error || "No stalls found"}</div>
          <button className="btn primary" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stall-wrap">
      <div className="toolbar">
        <div className="legend">
          <span className="pill pill-available">Available</span>
          <span className="pill pill-held">Selected</span>
          <span className="pill pill-booked">Reserved</span>
          <span className="pill pill-blocked">Blocked</span>
        </div>
        <div className="text-sm font-semibold text-gray-700">Selected: {selectedIds.length} / 3</div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="map">
        <text x={TOP.x + TOP.w / 2} y={TOP.y - 8} textAnchor="middle" className="area-title">TOP</text>
        <text x={LEFT.x + LEFT.w / 2} y={LEFT.y - 10} textAnchor="middle" className="area-title">LEFT</text>
        <text x={RIGHT.x + RIGHT.w / 2} y={RIGHT.y - 10} textAnchor="middle" className="area-title">RIGHT</text>
        <text x={CX} y={CY} textAnchor="middle" className="area-title center-title">RING</text>

        <circle cx={CX} cy={CY} r={OUTER_R_OUTER} className="guide" />
        <circle cx={CX} cy={CY} r={OUTER_R_INNER} className="guide" />
        <circle cx={CX} cy={CY} r={INNER_R_OUTER} className="guide" />
        <circle cx={CX} cy={CY} r={INNER_R_INNER} className="guide" />

        {stalls.map((st) => {
          const price = st.price ?? 0;
          const cls = `stall ${status[st.id]} ${st.size.toLowerCase()}`;
          const label = `${sizeLetter(st.size)} • ${price}`;

          if (st.shape === "rect") {
            return (
              <g key={st.id} onClick={() => handleStallClick(st.id)} className="stall-hit">
                <rect x={st.x} y={st.y} width={st.width} height={st.height} className={cls} />
                <text x={st.x + st.width / 2} y={st.y + st.height / 2} className="stall-label">{label}</text>
              </g>
            );
          }

          const d = arcPath(st.cx, st.cy, st.rInner, st.rOuter, st.startDeg, st.endDeg);
          const mid = (st.startDeg + st.endDeg) / 2;
          const p = polar(st.cx, st.cy, (st.rInner + st.rOuter) / 2, mid);
          return (
            <g key={st.id} onClick={() => handleStallClick(st.id)} className="stall-hit">
              <path d={d} className={cls} />
              <text x={p.x} y={p.y} className="stall-label">{label}</text>
            </g>
          );
        })}
      </svg>

      <div className="actions-bar">
        <span className="note">Note: <b>Maximum stall allocations are 3.</b></span>
        <button className="continue-btn" onClick={onContinue} disabled={selectedIds.length === 0}>
          Continue ({selectedIds.length})
        </button>
      </div>

      {showSummary && selectedIds.length > 0 && (
        <div ref={summaryRef}>
          <BookingSummary
            items={summaryItems()}
            onEdit={() => setShowSummary(false)}
            onConfirm={handleConfirmBooking}
          />
        </div>
      )}

      {pendingId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h4 className="text-m font-semibold">Confirm Selection</h4>
            <p className="text-sm text-gray-600 mt-1">Do you want to select <b>{pendingId}</b>?</p>
            <div className="modal-actions">
              <button className="btn primary" onClick={confirmSelect}>Confirm</button>
              <button className="btn ghost" onClick={cancelSelect}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

