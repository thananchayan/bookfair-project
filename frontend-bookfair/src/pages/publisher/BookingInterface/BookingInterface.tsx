import React, { useMemo, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { api } from "../../../lib/api";
import "./BookingInterface.css";

/* =============== Types =============== */
type StallSize = "SMALL" | "MEDIUM" | "LARGE";
type StallStatus = "available" | "held" | "processing" | "booked";

type RectStall = {
  id: string;
  shape: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  size: StallSize;
};
type ArcStall = {
  id: string;
  shape: "arc";
  cx: number;
  cy: number;
  rInner: number;
  rOuter: number;
  startDeg: number;
  endDeg: number;
  size: StallSize;
};
type Stall = RectStall | ArcStall;

type HallSizeConfig = {
  topRows: number;
  topCols: number;
  leftRows: number;
  leftCols: number;
  rightRows: number;
  rightCols: number;
  innerRing: number;
  outerRing: number;
};

const d2r = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(d2r(deg)),
  y: cy + r * Math.sin(d2r(deg)),
});
function arcPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  start: number,
  end: number
) {
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

/* =============== Stall generators =============== */
function makeRectGrid(
  prefix: string,
  x: number,
  y: number,
  w: number,
  h: number,
  rows: number,
  cols: number,
  gapX = 6,
  gapY = 6
): RectStall[] {
  const sizes: StallSize[] = ["SMALL", "MEDIUM", "LARGE"];
  const innerW = w - gapX * (cols - 1);
  const innerH = h - gapY * (rows - 1);
  const cellW = innerW / cols;
  const cellH = innerH / rows;
  const out: RectStall[] = [];
  let n = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({
        id: `${prefix}-${n}`,
        shape: "rect",
        x: x + c * (cellW + gapX),
        y: y + r * (cellH + gapY),
        width: cellW,
        height: cellH,
        size: sizes[(n - 1) % sizes.length],
      });
      n++;
    }
  }
  return out;
}

function makeArcRing(
  prefix: string,
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  count: number,
  gapDeg = 1
): ArcStall[] {
  const sizes: StallSize[] = ["SMALL", "MEDIUM", "LARGE"];
  const startDeg = -90,
    endDeg = 270;
  const sweep = (endDeg - startDeg) / count;
  const pad = gapDeg / 2;
  return Array.from({ length: count }, (_, i) => {
    const s = startDeg + i * sweep + pad;
    const e = s + sweep - gapDeg;
    return {
      id: `${prefix}-${i + 1}`,
      shape: "arc",
      cx,
      cy,
      rInner,
      rOuter,
      startDeg: s,
      endDeg: e,
      size: sizes[i % sizes.length],
    };
  });
}

const sizeLetter = (sz: StallSize) => (sz === "SMALL" ? "s" : sz === "MEDIUM" ? "m" : "l");

/* ---------- Pricing + utils ---------- */
const PRICES_LKR: Record<StallSize, number> = {
  SMALL: 50000,
  MEDIUM: 80000,
  LARGE: 120000,
};
const VAT_RATE = 0.15;
const SERVICE_FEE = 5000;

const hallOf = (id: string): "H1" | "H2" | "H3" | "H4" => {
  if (id.startsWith("T")) return "H1";
  if (id.startsWith("L")) return "H2";
  if (id.startsWith("R")) return "H3";
  return "H4";
};

const fmtLKR = (n: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);

/* ---------- Booking Summary ---------- */
function BookingSummary({
  items,
  onEdit,
  onConfirm,
}: {
  items: { id: string; size: StallSize; hall: string; price: number }[];
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const subtotal = items.reduce((s, it) => s + it.price, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat + SERVICE_FEE;

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
                <span className="badge">{it.hall}</span>
                <span className="id">{it.id}</span>
              </div>
              <div className="summary-sub">
                Size: <b>{it.size}</b>
              </div>
            </div>
            <div className="summary-price">{fmtLKR(it.price)}</div>
          </div>
        ))}
      </div>

      <div className="summary-totals">
        <div>
          <span>Subtotal</span>
          <b>{fmtLKR(subtotal)}</b>
        </div>
        <div>
          <span>Service fee</span>
          <b>{fmtLKR(SERVICE_FEE)}</b>
        </div>
        <div>
          <span>VAT ({Math.round(VAT_RATE * 100)}%)</span>
          <b>{fmtLKR(vat)}</b>
        </div>
        <hr />
        <div className="grand">
          <span>Grand Total</span>
          <b>{fmtLKR(total)}</b>
        </div>
      </div>

      <div className="summary-notes">
        <p>• You can reserve up to <b>3 stalls</b> per publisher.</p>
        <p>• Final allocation is subject to organizer approval.</p>
        <p>• Prices shown are indicative; taxes & fees may vary.</p>
      </div>

      <div className="summary-actions">
        <button className="btn ghost" onClick={onEdit}>
          Edit Selection
        </button>
        <button className="btn primary" onClick={onConfirm}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default function StallMap() {
  const location = useLocation();
  const { token, tokenType } = useAppSelector((s) => s.auth);
  const bookFairId = location.state?.bookFairId;

  // Canvas
  const W = 1000, H = 600;
  const CX = W / 2, CY = H * 0.62;

  // Rings geometry
  const INNER_R_INNER = 40;
  const INNER_R_OUTER = 100;
  const OUTER_R_INNER = 115;
  const OUTER_R_OUTER = 174;
  const CLEARANCE_TO_RING = 18;

  // Rectangular zones
  const TOP = { x: 170, y: 30, w: 660, h: 180 - CLEARANCE_TO_RING };
  const LEFT = { x: 45, y: 320, w: 260, h: 200 };
  const RIGHT = { x: 695, y: 320, w: 260, h: 200 };

  const LABELS = { top: "H1", left: "H2", right: "H3", center: "H4" };

  // State for hall config
  const [hallConfig, setHallConfig] = useState<HallSizeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hall configuration
  useEffect(() => {
    if (!bookFairId) {
      setError("No book fair selected");
      setLoading(false);
      return;
    }

    api
      .get(`/api/halls/hallSize/${bookFairId}`, {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      })
      .then((res) => {
        setHallConfig(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load hall configuration");
        setLoading(false);
      });
  }, [bookFairId, token, tokenType]);

  // Build stalls based on fetched config
  const stalls: Stall[] = useMemo(() => {
    if (!hallConfig) return [];

    const top = makeRectGrid("T", TOP.x, TOP.y, TOP.w, TOP.h, hallConfig.topRows, hallConfig.topCols, 6, 6);
    const left = makeRectGrid("L", LEFT.x, LEFT.y, LEFT.w, LEFT.h, hallConfig.leftRows, hallConfig.leftCols, 6, 6);
    const right = makeRectGrid("R", RIGHT.x, RIGHT.y, RIGHT.w, RIGHT.h, hallConfig.rightRows, hallConfig.rightCols, 6, 6);
    const innerRing = makeArcRing("I", CX, CY, INNER_R_INNER, INNER_R_OUTER, hallConfig.innerRing, 1);
    const outerRing = makeArcRing("O", CX, CY, OUTER_R_INNER, OUTER_R_OUTER, hallConfig.outerRing, 1);
    
    return [...top, ...left, ...right, ...innerRing, ...outerRing];
  }, [hallConfig]);

  // Selection state
  const [status, setStatus] = useState<Record<string, StallStatus>>({});
  
  useEffect(() => {
    if (stalls.length > 0) {
      setStatus(Object.fromEntries(stalls.map((s) => [s.id, "available"])));
    }
  }, [stalls]);

  const selectedIds = useMemo(
    () => Object.entries(status).filter(([, v]) => v === "held").map(([k]) => k),
    [status]
  );

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Scroll-to-summary ref
  const summaryRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (showSummary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showSummary]);

  const handleStallClick = (id: string) => {
    const curr = status[id];

    if (curr === "held") {
      setStatus((prev) => ({ ...prev, [id]: "available" }));
      if (showSummary && selectedIds.length - 1 <= 0) setShowSummary(false);
      return;
    }

    if (curr === "available") {
      if (selectedIds.length >= 3) {
        alert("Maximum stall allocations are 3.");
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

  const computeSummaryItems = () =>
    selectedIds.map((id) => {
      const s = stalls.find((x) => x.id === id)!;
      const size = s.size;
      return {
        id,
        size,
        hall: hallOf(id),
        price: PRICES_LKR[size],
      };
    });

  const handleConfirmBooking = () => {
    const items = computeSummaryItems();
    const ids = items.map((i) => i.id).join(", ");
    alert(`Booking submitted for: ${ids}\n(Stub action — wire to API)`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="stall-wrap">
        <div className="p-6 text-center text-gray-600">
          <div className="animate-pulse">Loading hall configuration...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hallConfig) {
    return (
      <div className="stall-wrap">
        <div className="p-6 text-center">
          <div className="text-rose-600 font-semibold mb-4">
            {error || "Failed to load hall configuration"}
          </div>
          <button 
            className="btn primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stall-wrap">
      <div className="toolbar">
        <div className="legend">
          <span className="pill pill-available">Available (blue)</span>
          <span className="pill pill-held">Selected (green)</span>
          <span className="pill pill-processing">Processing</span>
          <span className="pill pill-booked">Reserved</span>
        </div>
        <div className="text-sm font-semibold text-gray-700">Selected: {selectedIds.length} / 3</div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="map">
        {/* Area labels */}
        <text x={TOP.x + TOP.w / 2} y={TOP.y - 8} textAnchor="middle" className="area-title">
          {LABELS.top}
        </text>
        <text x={LEFT.x + LEFT.w / 2} y={LEFT.y - 10} textAnchor="middle" className="area-title">
          {LABELS.left}
        </text>
        <text x={RIGHT.x + RIGHT.w / 2} y={RIGHT.y - 10} textAnchor="middle" className="area-title">
          {LABELS.right}
        </text>
        <text x={CX} y={CY} textAnchor="middle" className="area-title center-title">
          {LABELS.center}
        </text>

        {/* Optional guide rings */}
        <circle cx={CX} cy={CY} r={OUTER_R_OUTER} className="guide" />
        <circle cx={CX} cy={CY} r={OUTER_R_INNER} className="guide" />
        <circle cx={CX} cy={CY} r={INNER_R_OUTER} className="guide" />
        <circle cx={CX} cy={CY} r={INNER_R_INNER} className="guide" />

        {/* Stalls */}
        {stalls.map((st) => {
          const cls = `stall ${status[st.id]} ${st.size.toLowerCase()}`;
          const label = `${st.id} • ${sizeLetter(st.size)}`;

          if (st.shape === "rect") {
            return (
              <g key={st.id} onClick={() => handleStallClick(st.id)} className="stall-hit">
                <rect x={st.x} y={st.y} width={st.width} height={st.height} className={cls} />
                <text x={st.x + st.width / 2} y={st.y + st.height / 2} className="stall-label">
                  {label}
                </text>
              </g>
            );
          }

          const d = arcPath(st.cx, st.cy, st.rInner, st.rOuter, st.startDeg, st.endDeg);
          const mid = (st.startDeg + st.endDeg) / 2;
          const p = polar(st.cx, st.cy, (st.rInner + st.rOuter) / 2, mid);

          return (
            <g key={st.id} onClick={() => handleStallClick(st.id)} className="stall-hit">
              <path d={d} className={cls} />
              <text x={p.x} y={p.y} className="stall-label">
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="actions-bar">
        <span className="note">
          Note: <b>Maximum stall allocations are 3.</b>
        </span>
        <button className="continue-btn" onClick={onContinue} disabled={selectedIds.length === 0}>
          Continue ({selectedIds.length})
        </button>
      </div>

      {/* Booking Summary */}
      {showSummary && selectedIds.length > 0 && (
        <div ref={summaryRef}>
          <BookingSummary
            items={computeSummaryItems()}
            onEdit={() => setShowSummary(false)}
            onConfirm={handleConfirmBooking}
          />
        </div>
      )}

      {/* Confirm modal */}
      {pendingId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h4 className="text-m font-semibold">Confirm Selection</h4>
            <p className="text-sm text-gray-600 mt-1">
              Do you want to select <b>{pendingId}</b>?
            </p>
            <div className="modal-actions">
              <button className="btn primary" onClick={confirmSelect}>
                Confirm
              </button>
              <button className="btn ghost" onClick={cancelSelect}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}