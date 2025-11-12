// LiteraryGenresCard.tsx
import React, { useEffect, useState } from "react";

type Genre = { id: string; name: string };

export default function LiteraryGenresCard() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [input, setInput] = useState("");
  const [showAll, setShowAll] = useState(false);

  // removal confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState<string>("");
  const [confirmTyped, setConfirmTyped] = useState<string>("");

  // Load/save between reloads
  useEffect(() => {
    try {
      const saved = localStorage.getItem("literary_genres");
      if (saved) setGenres(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("literary_genres", JSON.stringify(genres));
    } catch {}
  }, [genres]);

  const addGenre = () => {
    const name = input.trim();
    if (!name) return;
    const exists = genres.some((g) => g.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("That genre is already in the list.");
      return;
    }
    setGenres((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setInput("");
  };

  const openRemoveConfirm = (id: string) => {
    const g = genres.find((x) => x.id === id);
    if (!g) return;
    setConfirmId(id);
    setConfirmName(g.name);
    setConfirmTyped("");
    setConfirmOpen(true);
  };

  const doRemove = () => {
    if (!confirmId) return;
    setGenres((prev) => prev.filter((g) => g.id !== confirmId));
    setConfirmOpen(false);
    setConfirmId(null);
    setConfirmName("");
    setConfirmTyped("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addGenre();
  };

  const scrollOnCard = genres.length > 6;

  return (
    <>
      <div>
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a genre (e.g., Mystery)"
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            onClick={addGenre}
            className="px-3 py-2 rounded-md bg-sky-600 text-white font-medium hover:bg-sky-700 active:scale-[0.99]"
          >
            Add
          </button>
        </div>

        {genres.length === 0 && (
          <p className="text-sm mt-3 text-gray-500">
            No genres added yet. Use the field above to add your first genre.
          </p>
        )}

        {genres.length > 0 && (
          <div
            className={[
              "mt-2 flex flex-wrap gap-2 pr-1",
              scrollOnCard ? "max-h-24 overflow-y-auto" : "",
            ].join(" ")}
          >
            {genres.map((g) => (
              <span
                key={g.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-sm"
              >
                {g.name}
                <button
                  onClick={() => openRemoveConfirm(g.id)}
                  aria-label={`Remove ${g.name}`}
                  className="rounded-full w-5 h-5 inline-grid place-items-center text-sky-700 hover:bg-sky-100"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}

            {genres.length > 10 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-gray-50"
              >
                +{genres.length - 10} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full list modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">All Literary Genres</h4>
              <button
                onClick={() => setShowAll(false)}
                className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="p-4">
              {genres.length === 0 ? (
                <p className="text-sm text-gray-500">No genres yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {genres.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border bg-gray-50"
                    >
                      <span className="text-sm">{g.name}</span>
                      <button
                        onClick={() => openRemoveConfirm(g.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAll(false)}
                className="px-3 py-2 rounded-md border hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm remove modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="p-4 border-b">
              <h4 className="font-semibold">Remove genre</h4>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700">
                To confirm, type the genre name exactly as shown:
              </p>
              <p className="text-sm font-semibold bg-gray-100 rounded-md px-2 py-1 inline-block">
                {confirmName}
              </p>

              <input
                autoFocus
                value={confirmTyped}
                onChange={(e) => setConfirmTyped(e.target.value)}
                placeholder="Type genre name to confirm"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="p-4 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-2 rounded-md border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={doRemove}
                disabled={confirmTyped !== confirmName}
                className={[
                  "px-3 py-2 rounded-md text-white",
                  confirmTyped === confirmName
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed",
                ].join(" ")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
