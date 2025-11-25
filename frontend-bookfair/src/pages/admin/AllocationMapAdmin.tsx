import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

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

type HallStall = {
  id: number;
  bookFairId: number;
  stallName: string;
  hallId: number;
  hallName: string;
};

type AvailableStall = {
  id: number;
  stallName: string;
  size: string;
  status: string;
  description: string;
  price?: number;
};

type AllocatedHallStall = {
  id: number;
  hallStallID?: number;
  hallStallId?: number;
};

type AllocationRecord = {
  hallStallID: number;
  stallId: number;
};

const W = 1000;
const H = 600;
const CX = W / 2;
const CY = H * 0.62;
const TOP = { x: 170, y: 30, w: 660, h: 180 };
const LEFT = { x: 45, y: 320, w: 260, h: 200 };
const RIGHT = { x: 695, y: 320, w: 260, h: 200 };

const toRad = (d: number) => (d * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, ang: number) => ({
  x: cx + r * Math.cos(toRad(ang)),
  y: cy + r * Math.sin(toRad(ang)),
});
const arcPath = (cx: number, cy: number, r1: number, r2: number, start: number, end: number) => {
  const p1 = polar(cx, cy, r2, start);
  const p2 = polar(cx, cy, r2, end);
  const p3 = polar(cx, cy, r1, end);
  const p4 = polar(cx, cy, r1, start);
  const large = end - start > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r2} ${r2} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${r1} ${r1} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
};

const AllocationMapAdmin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookFairId = location.state?.bookFairId as number | undefined;

  const [config, setConfig] = useState<HallSizeConfig | null>(null);
  const [hallStalls, setHallStalls] = useState<HallStall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState<AvailableStall[]>([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [selectedStalls, setSelectedStalls] = useState<number[]>([]);
  const [allocatedHallStallIds, setAllocatedHallStallIds] = useState<number[]>([]);
  const [allocatedStallIds, setAllocatedStallIds] = useState<number[]>([]);
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [stallPrices, setStallPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!bookFairId) {
      setError("Missing book fair id");
      return;
    }
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cfg, stalls] = await Promise.all([
          api.get<HallSizeConfig>(`http://localhost:8087/api/halls/hallSize/${bookFairId}`),
          api.get<HallStall[]>(`http://localhost:8087/api/hall-stalls/hallStalls/${bookFairId}`),
        ]);
        setConfig(cfg.data || null);
        setHallStalls(stalls.data || []);
      } catch (err: any) {
        const msg =
          err?.response?.data?.data ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load hall map";
        setError(msg);
        setLoading(false);
        return;
      }

      // Fetch allocations best-effort so map still renders
      try {
        const [allocRes, allocRecords] = await Promise.all([
          api.get(`http://localhost:8087/api/stall-allocations/allocated/${bookFairId}`),
          api.get<{ data: AllocationRecord[] }>(`http://localhost:8087/api/stall-reservation/bookfair/${bookFairId}`),
        ]);
        const alloc = allocRes.data?.data || [];
        setAllocatedStallIds(alloc.map((s: any) => s.id));
        const hallAlloc = (allocRecords.data?.data || []) as AllocationRecord[];
        setAllocatedHallStallIds(hallAlloc.map((a) => a.hallStallID || a.hallStallId));
      } catch (err: any) {
        const msg =
          err?.response?.data?.data ||
          err?.response?.data?.message ||
          err?.message ||
          null;
        if (msg) toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookFairId]);

  const rects = useMemo(() => {
    if (!config) return [];
    const mk = (list: HallStall[], rows: number, cols: number, area: typeof TOP) => {
      if (rows <= 0 || cols <= 0) return [];
      const cw = area.w / cols;
      const ch = area.h / rows;
      return list.slice(0, rows * cols).map((st, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        return {
          id: st.id,
          label: st.stallName,
          x: area.x + c * cw + 3,
          y: area.y + r * ch + 3,
          w: cw - 6,
          h: ch - 6,
        };
      });
    };
    const tops = hallStalls.filter((s) => s.hallName.toUpperCase() === "TOP");
    const lefts = hallStalls.filter((s) => s.hallName.toUpperCase() === "LEFT");
    const rights = hallStalls.filter((s) => s.hallName.toUpperCase() === "RIGHT");
    return [
      ...mk(tops, config.topRows, config.topCols, TOP),
      ...mk(lefts, config.leftRows, config.leftCols, LEFT),
      ...mk(rights, config.rightRows, config.rightCols, RIGHT),
    ];
  }, [config, hallStalls]);

  const arcs = useMemo(() => {
    if (!config) return [];
    const ring = hallStalls.filter((s) => s.hallName.toUpperCase() === "RING");
    const inner = ring.slice(0, config.innerRing);
    const outer = ring.slice(config.innerRing);
    const make = (list: HallStall[], count: number, r1: number, r2: number) => {
      if (count <= 0) return [];
      const sweep = 360 / count;
      return list.slice(0, count).map((st, idx) => {
        const s = -90 + idx * sweep + 1;
        const e = s + sweep - 2;
        return { id: st.id, label: st.stallName, d: arcPath(CX, CY, r1, r2, s, e) };
      });
    };
    return [
      ...make(inner, config.innerRing, 40, 100),
      ...make(outer, config.outerRing, 120, 180),
    ];
  }, [config, hallStalls]);

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAvail = (id: number) => {
    if (allocatedStallIds.includes(id)) return;
    setSelectedStalls((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const loadAvailableStalls = async () => {
    if (!bookFairId) {
      toast.error("Missing book fair id");
      return;
    }
    setAvailLoading(true);
    setSelectedStalls([]);
    try {
      const [availRes, allocRes] = await Promise.all([
        api.get(`http://localhost:8087/api/stall-allocations/availableStalls/${bookFairId}`),
        api.get(`http://localhost:8087/api/stall-allocations/allocated/${bookFairId}`),
      ]);
      setAvailable(availRes.data?.data || []);
      const alloc = (allocRes.data?.data || []) as AllocatedHallStall[];
      setAllocatedStallIds(alloc.map((s) => s.id));
      setError(null);
      setShowAvailModal(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load available stalls";
      setError(msg);
      toast.error(msg);
    } finally {
      setAvailLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!bookFairId || selected.length === 0) {
      toast.error("Select at least one hall-stall");
      return;
    }
    if (selectedStalls.length !== selected.length) {
      toast.error("Select the same number of stalls as hall-stalls");
      return;
    }
    const hallStallAndStallIds = selected.map((id, idx) => {
      const stallId = selectedStalls[idx];
      const entryPrice = stallPrices[stallId] ?? price ?? 0;
      return { hallStallId: id, stallId, price: entryPrice };
    });
    try {
      const payload = {
        bookFairId,
        price: price || 0,
        hallStallAndStallIds,
      };
      await api.post("http://localhost:8087/api/stall-allocations/multipleStallAllocations", payload);
      toast.success("Allocation created");
      navigate("/admin/reservations");
    } catch (err: any) {
      const msg = err?.response?.data?.data || err?.response?.data?.message || err?.message || "Allocation failed";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold text-foreground">Stall Allocation Map</h1>
          <p className="text-sm text-muted-foreground">Book Fair ID: {bookFairId ?? "-"}</p>
        </div>
        <div className="flex items-center gap-2">
         
          <button
            className="px-3 py-2 text-sm border rounded bg-white hover:bg-gray-50"
            onClick={loadAvailableStalls}
            disabled={availLoading || !bookFairId}
          >
            Load Available Stalls
          </button>
          
          <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {loading && <div className="p-6 text-center text-gray-600">Loading map...</div>}
      {error && <div className="p-6 text-center text-rose-600">{error}</div>}

      {!loading && !error && config && hallStalls.length > 0 && (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="border rounded bg-gray-50 shadow">
          {rects.map((r) => (
            <g
              key={r.id}
              onClick={() => {
                if (!allocatedHallStallIds.includes(r.id)) toggle(r.id);
              }}
              className="cursor-pointer"
            >
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                className={`stroke-2 ${
                  allocatedHallStallIds.includes(r.id)
                    ? "fill-gray-200 stroke-gray-500"
                    : selected.includes(r.id)
                    ? "fill-green-200 stroke-green-500"
                    : "fill-blue-50 stroke-blue-300"
                }`}
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] fill-gray-800 font-semibold"
              >
                {r.label}
              </text>
            </g>
          ))}

          {arcs.map((a) => (
            <g
              key={a.id}
              onClick={() => {
                if (!allocatedHallStallIds.includes(a.id)) toggle(a.id);
              }}
              className="cursor-pointer"
            >
              <path
                d={a.d}
                className={`stroke-2 ${
                  allocatedHallStallIds.includes(a.id)
                    ? "fill-gray-200 stroke-gray-500"
                    : selected.includes(a.id)
                    ? "fill-green-200 stroke-green-500"
                    : "fill-blue-50 stroke-blue-300"
                }`}
              />
            </g>
          ))}
        </svg>
      )}

      {showAvailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-100 p-5 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAvailModal(false)}
              aria-label="Close available stalls"
            >
              ✕
            </button>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Available Stalls</h4>
                <p className="text-sm text-gray-600">Select {selected.length} stalls to match hall-stalls.</p>
              </div>
              <button
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleAllocate}
                disabled={loading || selected.length === 0 || selectedStalls.length !== selected.length}
              >
                Stall Allocation
              </button>
            </div>
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Stall</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Size</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Price</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {available.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-semibold text-gray-900">{s.stallName}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{s.size}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{s.status}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <input
                          type="number"
                          min={0}
                          value={stallPrices[s.id] ?? price ?? 0}
                          onChange={(e) =>
                            setStallPrices((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))
                          }
                          className="w-24 border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-600 max-w-xl truncate">{s.description}</td>
                      <td className="px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedStalls.includes(s.id)}
                          onChange={() => toggleAvail(s.id)}
                          disabled={allocatedStallIds.includes(s.id)}
                        />
                        {allocatedStallIds.includes(s.id) && (
                          <span className="ml-2 text-xs text-gray-500">(Allocated)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Hall-stalls selected: {selected.length} | Stalls selected: {selectedStalls.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationMapAdmin;
