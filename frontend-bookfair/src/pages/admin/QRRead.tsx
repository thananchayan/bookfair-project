import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../store/hooks";

type QrResponse = {
  success: boolean;
  message: string;
  data?: {
    userId: number;
    bookFairName: string;
    status: string;
    stalls: { hallName: string; stallName: string; stallSize: string }[];
  };
};

export default function QRRead() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QrResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { token, tokenType } = useAppSelector((s) => s.auth);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a QR image first.");
      return;
    }
    if (!token) {
      setError("You must be logged in to scan QR codes.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const headers: Record<string, string> = {
        Authorization: `${tokenType || "Bearer"} ${token}`,
      };
      const res = await fetch("http://localhost:8087/api/qr", {
        method: "POST",
        body: formData,
        headers,
      });
      const data: QrResponse = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to read QR code");
      }
      setResult(data);
      setShowModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to read QR code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Admin</p>
          <h1 className="text-2xl font-semibold text-gray-900">QR Read</h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload a reservation QR image to validate and view booking details instantly.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-indigo-100 bg-white shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Scan QR</h2>
                <p className="text-sm text-gray-600">
                  Drop a QR image or click to browse. We will send it to the validator service.
                </p>
              </div>
            </div>

            <label
              htmlFor="qr-file"
              className="cursor-pointer border-2 border-dashed border-indigo-200 rounded-lg p-6 flex flex-col items-center justify-center text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-500 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm font-medium text-indigo-700">
                {file ? file.name : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG / JPG up to ~5MB</p>
              <input
                id="qr-file"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Scanning..." : "Scan QR"}
              </button>
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            {result && (
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                Last scan success
              </span>
            )}
          </div>
          {preview ? (
            <img
              src={preview}
              alt="QR preview"
              className="w-full max-h-80 object-contain rounded-md border border-gray-200 bg-gray-50"
            />
          ) : (
            <div className="h-52 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500 bg-gray-50">
              QR image preview will appear here
            </div>
          )}
          {result && (
            <div className="text-sm text-gray-700 rounded-lg border border-green-100 bg-green-50 p-3">
              <p className="font-semibold text-green-800">Ready to view details</p>
              <p className="text-gray-700">
                {result.data?.bookFairName} - Status: {result.data?.status}
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && result?.data && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Scan Result
                </p>
                <h3 className="text-lg font-semibold text-gray-900">{result.data.bookFairName}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
                aria-label="Close"
              >
                X
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">User ID</p>
                  <p className="font-medium">{result.data.userId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border border-green-200 text-green-700 bg-green-50">
                    {result.data.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Stalls</p>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Hall</th>
                        <th className="px-4 py-2 text-left font-semibold">Stall</th>
                        <th className="px-4 py-2 text-left font-semibold">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.data.stalls.map((s, idx) => (
                        <tr key={`${s.hallName}-${s.stallName}-${idx}`} className="bg-white">
                          <td className="px-4 py-2 text-gray-800">{s.hallName}</td>
                          <td className="px-4 py-2 text-gray-800">{s.stallName}</td>
                          <td className="px-4 py-2 text-gray-800">{s.stallSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
