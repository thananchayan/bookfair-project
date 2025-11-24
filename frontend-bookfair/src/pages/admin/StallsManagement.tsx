import React, { useMemo, useState } from "react";

type StallSize = "SMALL" | "MEDIUM" | "LARGE";
type HallId = "H1" | "H2" | "H3" | "H4";

type HallMeta = {
  id: HallId;
  name: string;
  type: "RECT" | "ROUND";
  description: string;
};

const HALLS: HallMeta[] = [
  { id: "H1", name: "Hall 1 (Top)", type: "RECT", description: "Top rectangular hall" },
  { id: "H2", name: "Hall 2 (Left)", type: "RECT", description: "Left rectangular hall" },
  { id: "H3", name: "Hall 3 (Right)", type: "RECT", description: "Right rectangular hall" },
  { id: "H4", name: "Hall 4 (Round)", type: "ROUND", description: "Central round hall with inner & outer ring" },
];

const HALL_PREFIX: Record<HallId, { rectPrefix?: string; innerPrefix?: string; outerPrefix?: string }> = {
  H1: { rectPrefix: "T" },
  H2: { rectPrefix: "L" },
  H3: { rectPrefix: "R" },
  H4: { innerPrefix: "I", outerPrefix: "O" },
};

type BookFair = {
  id: string;
  name: string;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
};

type Stall = {
  id: string;
  bookFairId: string;
  hallId: HallId;
  size: StallSize;
  row?: number;
  col?: number;
  ring?: "INNER" | "OUTER";
  basePrice: number;
  overridePrice?: number;
};

type SizeCounts = {
  SMALL: number;
  MEDIUM: number;
  LARGE: number;
};

const defaultGlobalPrices: Record<StallSize, number> = {
  SMALL: 50000,
  MEDIUM: 80000,
  LARGE: 120000,
};

const AdminStallManagement: React.FC = () => {
  /* ---------- Book Fair state ---------- */
  const [bookFairs, setBookFairs] = useState<BookFair[]>([]);
  const [selectedBookFairId, setSelectedBookFairId] = useState<string>("");

  // Create book fair form
  const [fairName, setFairName] = useState("");
  const [fairYear, setFairYear] = useState<number>(new Date().getFullYear());
  const [fairLocation, setFairLocation] = useState("");
  const [fairStartDate, setFairStartDate] = useState("");
  const [fairEndDate, setFairEndDate] = useState("");

  const currentFair = useMemo(
    () => bookFairs.find((b) => b.id === selectedBookFairId),
    [bookFairs, selectedBookFairId]
  );

  const handleCreateFair = () => {
    if (!fairName.trim() || !fairLocation.trim() || !fairStartDate || !fairEndDate) {
      alert("Please fill name, location, start date and end date.");
      return;
    }

    const id = `BF-${fairYear}-${bookFairs.length + 1}`;
    const newFair: BookFair = {
      id,
      name: fairName.trim(),
      year: fairYear,
      location: fairLocation.trim(),
      startDate: fairStartDate,
      endDate: fairEndDate,
    };

    setBookFairs((prev) => [...prev, newFair]);
    setSelectedBookFairId(id);

    // Clear form
    setFairName("");
    setFairLocation("");
    setFairStartDate("");
    setFairEndDate("");
  };

  /* ---------- Hall + Stall state ---------- */
  const [selectedHall, setSelectedHall] = useState<HallId>("H1");

  const [globalPrices, setGlobalPrices] =
    useState<Record<StallSize, number>>(defaultGlobalPrices);

  // Rect halls
  const [rectRows, setRectRows] = useState(2);
  const [rectCols, setRectCols] = useState(10);
  const [rectSizeCounts, setRectSizeCounts] = useState<SizeCounts>({
    SMALL: 10,
    MEDIUM: 6,
    LARGE: 4,
  });

  // Round hall (H4)
  const [innerTotal, setInnerTotal] = useState(12);
  const [outerTotal, setOuterTotal] = useState(18);
  const [innerSizeCounts, setInnerSizeCounts] = useState<SizeCounts>({
    SMALL: 4,
    MEDIUM: 4,
    LARGE: 4,
  });
  const [outerSizeCounts, setOuterSizeCounts] = useState<SizeCounts>({
    SMALL: 6,
    MEDIUM: 6,
    LARGE: 6,
  });

  const [stalls, setStalls] = useState<Stall[]>([]);

  const currentHallMeta = useMemo(
    () => HALLS.find((h) => h.id === selectedHall)!,
    [selectedHall]
  );

  const hallStalls = useMemo(
    () =>
      stalls.filter(
        (s) => s.bookFairId === selectedBookFairId && s.hallId === selectedHall
      ),
    [stalls, selectedBookFairId, selectedHall]
  );

  /* ---------- Helpers ---------- */

  const sumSizeCounts = (c: SizeCounts) => c.SMALL + c.MEDIUM + c.LARGE;

  const generateSizeList = (counts: SizeCounts): StallSize[] => {
    const arr: StallSize[] = [];
    for (let i = 0; i < counts.SMALL; i++) arr.push("SMALL");
    for (let i = 0; i < counts.MEDIUM; i++) arr.push("MEDIUM");
    for (let i = 0; i < counts.LARGE; i++) arr.push("LARGE");
    return arr;
  };

  const ensureFairSelected = () => {
    if (!selectedBookFairId || !currentFair) {
      alert("Please create or select a Book Fair first.");
      return false;
    }
    return true;
  };

  /* ---------- Generate Rect Halls ---------- */

  const handleGenerateRect = () => {
    if (!ensureFairSelected()) return;

    const totalCells = rectRows * rectCols;
    const totalSizes = sumSizeCounts(rectSizeCounts);
    if (totalCells !== totalSizes) {
      alert(
        `Rows x Columns = ${totalCells}, but you allocated ${totalSizes} stalls by size. These must match.`
      );
      return;
    }

    const { rectPrefix } = HALL_PREFIX[selectedHall];
    if (!rectPrefix) {
      alert("Selected hall is not configured as rectangular.");
      return;
    }

    const sizes = generateSizeList(rectSizeCounts);
    const newStalls: Stall[] = [];
    let index = 0;

    for (let r = 1; r <= rectRows; r++) {
      for (let c = 1; c <= rectCols; c++) {
        const size = sizes[index];
        const stallId = `${rectPrefix}-${index + 1}`;
        newStalls.push({
          id: stallId,
          bookFairId: selectedBookFairId,
          hallId: selectedHall,
          row: r,
          col: c,
          size,
          basePrice: globalPrices[size],
        });
        index++;
      }
    }

    setStalls((prev) => [
      ...prev.filter(
        (s) => !(s.bookFairId === selectedBookFairId && s.hallId === selectedHall)
      ),
      ...newStalls,
    ]);
  };

  /* ---------- Generate Round Hall (H4) ---------- */

  const handleGenerateRound = () => {
    if (!ensureFairSelected()) return;

    if (selectedHall !== "H4") {
      alert("Round configuration only applies to Hall 4.");
      return;
    }

    const innerSum = sumSizeCounts(innerSizeCounts);
    const outerSum = sumSizeCounts(outerSizeCounts);

    if (innerSum !== innerTotal) {
      alert(
        `Inner ring total stalls = ${innerTotal}, but you allocated ${innerSum} by size. These must match.`
      );
      return;
    }
    if (outerSum !== outerTotal) {
      alert(
        `Outer ring total stalls = ${outerTotal}, but you allocated ${outerSum} by size. These must match.`
      );
      return;
    }

    const { innerPrefix, outerPrefix } = HALL_PREFIX["H4"];
    if (!innerPrefix || !outerPrefix) {
      alert("Round hall prefixes are not configured.");
      return;
    }

    const innerSizes = generateSizeList(innerSizeCounts);
    const outerSizes = generateSizeList(outerSizeCounts);
    const newStalls: Stall[] = [];

    innerSizes.forEach((size, index) => {
      const stallId = `${innerPrefix}-${index + 1}`;
      newStalls.push({
        id: stallId,
        bookFairId: selectedBookFairId,
        hallId: "H4",
        ring: "INNER",
        size,
        basePrice: globalPrices[size],
      });
    });

    outerSizes.forEach((size, index) => {
      const stallId = `${outerPrefix}-${index + 1}`;
      newStalls.push({
        id: stallId,
        bookFairId: selectedBookFairId,
        hallId: "H4",
        ring: "OUTER",
        size,
        basePrice: globalPrices[size],
      });
    });

    setStalls((prev) => [
      ...prev.filter((s) => !(s.bookFairId === selectedBookFairId && s.hallId === "H4")),
      ...newStalls,
    ]);
  };

  /* ---------- Price CRUD ---------- */

  const handleGlobalPriceChange = (size: StallSize, value: string) => {
    const n = Number(value) || 0;
    setGlobalPrices((prev) => ({ ...prev, [size]: n }));
  };

  const handleOverridePriceChange = (stallId: string, value: string) => {
    const n = value === "" ? undefined : Number(value) || 0;
    setStalls((prev) =>
      prev.map((s) => (s.id === stallId ? { ...s, overridePrice: n } : s))
    );
  };

  const handleDeleteStall = (stallId: string) => {
    if (!window.confirm(`Delete stall ${stallId}?`)) return;
    setStalls((prev) => prev.filter((s) => s.id !== stallId));
  };

  const handleClearHall = () => {
    if (!currentFair) return;
    if (!window.confirm(`Remove all stalls for ${currentFair.name} – ${currentHallMeta.name}?`))
      return;
    setStalls((prev) =>
      prev.filter(
        (s) => !(s.bookFairId === selectedBookFairId && s.hallId === selectedHall)
      )
    );
  };

  const totalBase = hallStalls.reduce((sum, s) => sum + s.basePrice, 0);
  const totalOverride = hallStalls.reduce(
    (sum, s) => sum + (s.overridePrice ?? s.basePrice),
    0
  );

  const handleSaveConfig = () => {
    if (!currentFair) {
      alert("No Book Fair selected.");
      return;
    }
    const payload = {
      bookFair: currentFair,
      halls: HALLS,
      stalls: stalls.filter((s) => s.bookFairId === selectedBookFairId),
    };
    console.log("BookFair config payload ->", payload);
    alert("Configuration ready to send to API (check console.log).");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Book Fair & Stall Layout Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          First create a Book Fair, then configure its halls, stalls and prices.
        </p>
      </div>

      {/* 1. Book Fair creation + selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">1. Book Fair</h2>

        {/* Existing book fairs */}
        {bookFairs.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Select existing Book Fair
            </label>
            <select
              value={selectedBookFairId}
              onChange={(e) => setSelectedBookFairId(e.target.value)}
              className="w-full sm:w-80 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" disabled>
                -- Select Book Fair --
              </option>
              {bookFairs.map((bf) => (
                <option key={bf.id} value={bf.id}>
                  {bf.name} ({bf.year}) – {bf.location}
                </option>
              ))}
            </select>
            {currentFair && (
              <p className="mt-1 text-xs text-gray-500">
                {currentFair.name} | {currentFair.location} | {currentFair.startDate} –{" "}
                {currentFair.endDate}
              </p>
            )}
          </div>
        )}

        {/* Create new book fair */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Create a new Book Fair
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fair name
              </label>
              <input
                type="text"
                value={fairName}
                onChange={(e) => setFairName(e.target.value)}
                placeholder="Colombo International Book Fair"
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={fairYear}
                onChange={(e) =>
                  setFairYear(Number(e.target.value) || new Date().getFullYear())
                }
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location / Venue
              </label>
              <input
                type="text"
                value={fairLocation}
                onChange={(e) => setFairLocation(e.target.value)}
                placeholder="BMICH, Colombo"
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start date
              </label>
              <input
                type="date"
                value={fairStartDate}
                onChange={(e) => setFairStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End date
              </label>
              <input
                type="date"
                value={fairEndDate}
                onChange={(e) => setFairEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleCreateFair}
              className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            >
              Create Book Fair
            </button>
          </div>
        </div>
      </div>

      {/* If no fair selected, stop here */}
      {!currentFair && (
        <p className="text-sm text-red-500">
          Please create a Book Fair above and select it before configuring halls & stalls.
        </p>
      )}

      {currentFair && (
        <>
          {/* 2. Hall selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              2. Select Hall (for {currentFair.name})
            </h2>
            <div className="flex flex-wrap gap-3">
              {HALLS.map((hall) => (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => setSelectedHall(hall.id)}
                  className={[
                    "px-4 py-2 rounded-md border text-sm font-medium",
                    hall.id === selectedHall
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {hall.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{currentHallMeta.description}</p>
          </div>

          {/* 3. Default prices */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              3. Default Stall Prices (per stall)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["SMALL", "MEDIUM", "LARGE"] as StallSize[]).map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <label className="w-24 text-xs font-medium text-gray-700">
                    {size}
                  </label>
                  <div className="flex-1 flex items-center gap-1">
                    <span className="text-xs text-gray-500">LKR</span>
                    <input
                      type="number"
                      min={0}
                      value={globalPrices[size]}
                      onChange={(e) => handleGlobalPriceChange(size, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              These are default prices; individual stalls can override this price in the table
              below.
            </p>
          </div>

          {currentHallMeta.type === "RECT" ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                4. Rectangular Hall Layout (Rows, Columns & Size Allocation)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rectRows}
                    onChange={(e) => setRectRows(Number(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rectCols}
                    onChange={(e) => setRectCols(Number(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-xs text-gray-600">
                    Total cells:{" "}
                    <span className="font-semibold">{rectRows * rectCols}</span>, allocated
                    by size:{" "}
                    <span className="font-semibold">
                      {sumSizeCounts(rectSizeCounts)} (S: {rectSizeCounts.SMALL}, M:{" "}
                      {rectSizeCounts.MEDIUM}, L: {rectSizeCounts.LARGE})
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-gray-700 mb-2">Size Allocation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {(["SMALL", "MEDIUM", "LARGE"] as StallSize[]).map((size) => (
                  <div key={size}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {size} stalls
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={rectSizeCounts[size]}
                      onChange={(e) =>
                        setRectSizeCounts((prev) => ({
                          ...prev,
                          [size]: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleGenerateRect}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                >
                  Generate stalls for {currentHallMeta.name}
                </button>
                {hallStalls.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHall}
                    className="inline-flex items-center px-3 py-2 rounded-md border border-red-500 text-red-600 text-xs font-medium hover:bg-red-50"
                  >
                    Clear all stalls for this hall
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                4. Round Hall Layout (Inner & Outer Ring)
              </h2>

              {/* Inner ring */}
              <div className="mb-4 border-b border-gray-100 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">
                  Inner Ring (H4 - Inner)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total inner stalls
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={innerTotal}
                      onChange={(e) => setInnerTotal(Number(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  {(["SMALL", "MEDIUM", "LARGE"] as StallSize[]).map((size) => (
                    <div key={size}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {size} (inner)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={innerSizeCounts[size]}
                        onChange={(e) =>
                          setInnerSizeCounts((prev) => ({
                            ...prev,
                            [size]: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Inner ring allocated by size: {sumSizeCounts(innerSizeCounts)} stalls.
                </p>
              </div>

              {/* Outer ring */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">
                  Outer Ring (H4 - Outer)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total outer stalls
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={outerTotal}
                      onChange={(e) => setOuterTotal(Number(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  {(["SMALL", "MEDIUM", "LARGE"] as StallSize[]).map((size) => (
                    <div key={size}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {size} (outer)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={outerSizeCounts[size]}
                        onChange={(e) =>
                          setOuterSizeCounts((prev) => ({
                            ...prev,
                            [size]: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Outer ring allocated by size: {sumSizeCounts(outerSizeCounts)} stalls.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleGenerateRound}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                >
                  Generate stalls for Hall 4 (Round)
                </button>
                {hallStalls.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHall}
                    className="inline-flex items-center px-3 py-2 rounded-md border border-red-500 text-red-600 text-xs font-medium hover:bg-red-50"
                  >
                    Clear all stalls for this hall
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. Summary / CRUD table */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                5. Stall Summary & Price Overrides – {currentFair.name} /{" "}
                {currentHallMeta.name}
              </h2>
              <div className="text-xs text-gray-600">
                Total stalls: <b>{hallStalls.length}</b> | Base sum:{" "}
                <b>LKR {totalBase.toLocaleString("en-LK")}</b> | Effective sum (with overrides):{" "}
                <b>LKR {totalOverride.toLocaleString("en-LK")}</b>
              </div>
            </div>

            {hallStalls.length === 0 ? (
              <p className="text-xs text-gray-500">
                No stalls generated yet for this hall and book fair. Configure layout above and
                click <b>Generate stalls</b>.
              </p>
            ) : (
              <div className="overflow-x-auto max-h-[420px] border border-gray-100 rounded-md">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Stall ID
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Hall
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Pos / Ring
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Size
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Base Price
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Override Price
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {hallStalls.map((s) => (
                      <tr key={s.id}>
                        <td className="px-3 py-2 font-medium text-gray-800">{s.id}</td>
                        <td className="px-3 py-2 text-gray-700">{s.hallId}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {s.row && s.col && (
                            <span>
                              Row {s.row}, Col {s.col}
                            </span>
                          )}
                          {s.ring && (
                            <span className="uppercase text-[11px] font-semibold">
                              {s.ring === "INNER" ? "Inner Ring" : "Outer Ring"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-700">{s.size}</td>
                        <td className="px-3 py-2 text-gray-700">
                          LKR {s.basePrice.toLocaleString("en-LK")}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-gray-500">LKR</span>
                            <input
                              type="number"
                              min={0}
                              value={s.overridePrice ?? ""}
                              onChange={(e) =>
                                handleOverridePriceChange(s.id, e.target.value)
                              }
                              placeholder={s.basePrice.toString()}
                              className="w-28 border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteStall(s.id)}
                            className="inline-flex items-center px-2 py-1 rounded-md border border-red-500 text-red-600 text-[11px] font-medium hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {currentFair && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                >
                  Save configuration for {currentFair.name} (stub)
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStallManagement;
