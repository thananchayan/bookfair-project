import React, { useMemo, useState } from "react";
import "./BookinInterface.css";

/** ---- Types ---- */
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

type Stall = (RectStall | ArcStall);

/** ---- Helpers ---- */
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

/** Generate a grid of rectangular stalls inside a given area */
function makeRectGrid(
  prefix: string,
  x: number, y: number, w: number, h: number,
  rows: number, cols: number,
  size: StallSize
): RectStall[] {
  const cellW = w / cols;
  const cellH = h / rows;
  const out: RectStall[] = [];
  let n = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({
        id: `${prefix}-${n++}`,
        shape: "rect",
        x: x + c * cellW,
        y: y + r * cellH,
        width: cellW,
        height: cellH,
        size,
      });
    }
  }
  return out;
}

/** Generate arc stalls for the outer ring */
function makeArcRing(
  prefix: string,
  cx: number, cy: number,
  rInner: number, rOuter: number,
  startDeg: number, endDeg: number,
  count: number,
  size: StallSize
): ArcStall[] {
  const sweep = (endDeg - startDeg) / count;
  const out: ArcStall[] = [];
  for (let i = 0; i < count; i++) {
    const s = startDeg + i * sweep;
    const e = s + sweep;
    out.push({
      id: `${prefix}-${i + 1}`,
      shape: "arc",
      cx, cy, rInner, rOuter,
      startDeg: s, endDeg: e,
      size,
    });
  }
  return out;
}

/** ---- Component ---- */
export default function StallMap() {
  // Canvas size matches the sketch proportions
  const W = 1000;
  const H = 600;

  // Central circle center
  const CX = W / 2;
  const CY = H * 0.62;

  // Build layout (you can tweak rows/cols/counts as needed)
  const stalls: Stall[] = useMemo(() => {
    const top = makeRectGrid("T", 170, 30, 660, 180, 2, 8, "LARGE"); // big top zone
    const left = makeRectGrid("L", 45, 320, 260, 200, 2, 3, "MEDIUM");
    const right = makeRectGrid("R", 695, 320, 260, 200, 2, 3, "MEDIUM");

    // Circular plaza: outer ring (12), and a few small wedges (4) on top-right like the sketch
    const outer = makeArcRing("O", CX, CY, 120, 180, -90, 270, 12, "SMALL");
    const micro = makeArcRing("S", CX, CY, 80, 120, -30, 40, 4, "SMALL"); // tiny wedges

    return [...top, ...left, ...right, ...outer, ...micro];
  }, []);

  // Status state for each stall
  const [status, setStatus] = useState<Record<string, StallStatus>>(
    Object.fromEntries(stalls.map(s => [s.id, "available"]))
  );

  // Toggle logic: available <-> held (you can wire to API for processing/booked)
  const onStallClick = (id: string) => {
    setStatus(prev => {
      const curr = prev[id];
      if (curr === "available") return { ...prev, [id]: "held" };
      if (curr === "held") return { ...prev, [id]: "available" };
      return prev; // ignore clicks when processing/booked
    });
  };

  // Example controls to simulate server steps
  const setProcessing = () =>
    setStatus(prev => {
      const upd = { ...prev };
      Object.entries(upd).forEach(([k, v]) => {
        if (v === "held") upd[k] = "processing";
      });
      return upd;
    });

  const setBooked = () =>
    setStatus(prev => {
      const upd = { ...prev };
      Object.entries(upd).forEach(([k, v]) => {
        if (v === "processing") upd[k] = "booked";
      });
      return upd;
    });

  const resetHeld = () =>
    setStatus(prev => {
      const upd = { ...prev };
      Object.entries(upd).forEach(([k, v]) => {
        if (v === "held") upd[k] = "available";
      });
      return upd;
    });

  return (
    <div className="stall-wrap">
      <div className="toolbar">
        <div className="legend">
          <span className="pill available">Available</span>
          <span className="pill held">Selected</span>
          <span className="pill processing">Processing</span>
          <span className="pill booked">Booked</span>
        </div>
        <div className="actions">
          <button onClick={setProcessing} className="btn warn">Mark Held → Processing</button>
          <button onClick={setBooked} className="btn good">Mark Processing → Booked</button>
          <button onClick={resetHeld} className="btn">Clear Selected</button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="map">
        {/* Orange guides like your sketch */}
        <circle cx={CX} cy={CY} r={180} className="guide" />
        <circle cx={CX} cy={CY} r={120} className="guide" />

        {/* Draw stalls */}
        {stalls.map(st => {
          const cls = `stall ${status[st.id]} ${st.size.toLowerCase()}`;
          if (st.shape === "rect") {
            return (
              <g key={st.id} onClick={() => onStallClick(st.id)} className="stall-hit">
                <rect
                  x={st.x}
                  y={st.y}
                  width={st.width}
                  height={st.height}
                  className={cls}
                />
                <text x={st.x + st.width / 2} y={st.y + st.height / 2}
                      className="stall-label">
                  {st.id}
                </text>
              </g>
            );
          }
          // arc
          const d = arcPath(st.cx, st.cy, st.rInner, st.rOuter, st.startDeg, st.endDeg);
          // Place label at arc mid-angle
          const mid = (st.startDeg + st.endDeg) / 2;
          const p = polar(st.cx, st.cy, (st.rInner + st.rOuter) / 2, mid);
          return (
            <g key={st.id} onClick={() => onStallClick(st.id)} className="stall-hit">
              <path d={d} className={cls} />
              <text x={p.x} y={p.y} className="stall-label">{st.id}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
