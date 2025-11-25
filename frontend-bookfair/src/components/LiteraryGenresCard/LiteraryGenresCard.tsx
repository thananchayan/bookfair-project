import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { useAppSelector } from "../../store/hooks";

type GenreOption = {
  code: string;
  label: string;
};

const GENRES: GenreOption[] = [
  { code: "FICTION_LITERATURE", label: "Fiction & Literature" },
  { code: "EDUCATIONAL_ACADEMIC", label: "Educational & Academic" },
  { code: "CHILDRENS_YOUNG_ADULT", label: "Children's & Young Adult" },
  { code: "SELF_HELP_PERSONAL_DEVELOPMENT", label: "Self-Help & Personal Development" },
  { code: "SCIENCE_TECHNOLOGY", label: "Science & Technology" },
];

export default function LiteraryGenresCard() {
  const { userId, token, tokenType } = useAppSelector((s) => s.auth);
  const [selected, setSelected] = useState<string>(GENRES[0].code);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derive display label or fallback
  const currentLabel = useMemo(
    () => (currentGenre ? GENRES.find((g) => g.code === currentGenre)?.label || currentGenre : null),
    [currentGenre],
  );

  // Load current genre on mount/user change
  useEffect(() => {
    const fetchGenre = async () => {
      if (!userId || !token) return;
      setError(null);
      try {
        const { data } = await api.get(`http://localhost:8087/api/users/bookGenres/${userId}`, {
          headers: { Authorization: `${tokenType || "Bearer"} ${token}` },
        });
        const g = data?.data?.bookGenres;
        if (g) {
          setCurrentGenre(g);
          setSelected(g);
        }
      } catch (err: any) {
        // silent load error, only show if API returns message
        const msg = err?.response?.data?.message || err?.message;
        if (msg) setError(msg);
      }
    };
    fetchGenre();
  }, [userId, token, tokenType]);

  const handleSave = async () => {
    if (!userId) {
      setError("User not found. Please log in again.");
      return;
    }
    if (!token) {
      setError("Authentication required to save genres.");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { data } = await api.put(
        `http://localhost:8087/api/users/bookGenres/update/${userId}`,
        null,
        {
          params: { bookGenres: selected },
          headers: { Authorization: `${tokenType || "Bearer"} ${token}` },
        },
      );
      const updated = data?.data?.bookGenres || selected;
      setCurrentGenre(updated);
      setMessage("Genre saved for your profile.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.data ||
        err?.message ||
        "Failed to save genre.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select a genre</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {GENRES.map((g) => (
            <option key={g.code} value={g.code}>
              {g.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Genre"}
        </button>
      </div>

      {message && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {message}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <p className="text-xs uppercase text-gray-500 font-semibold">Current Genre</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
            {currentLabel || "Not selected"}
          </span>
        </div>
      </div>
    </div>
  );
}
