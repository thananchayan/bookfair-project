import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

type Stall = {
  id: number;
  stallName: string;
  size: string;
  status: string;
  description: string;
};

type StallForm = {
  stallName: string;
  size: string;
  status: string;
  description: string;
};

const emptyForm: StallForm = {
  stallName: "",
  size: "SMALL",
  status: "AVAILABLE",
  description: "",
};

const AdminStallManagement: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StallForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchStalls = () => {
    setLoading(true);
    setError(null);
    api
      .get("http://localhost:8087/api/stalls/getAll")
      .then((res) => setStalls(res.data?.data || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load stalls"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stalls.filter((s) =>
      s.stallName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  }, [stalls, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.stallName.trim()) {
      toast.error("Stall name is required");
      return;
    }
    try {
      if (editingId) {
        await api.put(`http://localhost:8087/api/stalls/${editingId}`, form);
        toast.success("Stall updated");
      } else {
        await api.post("http://localhost:8087/api/stalls", form);
        toast.success("Stall created");
      }
      resetForm();
      fetchStalls();
    } catch (err: any) {
      const msg = err?.response?.data?.data || err?.response?.data?.message || err?.message || "Failed to save stall";
      toast.error(msg);
    }
  };

  const handleEdit = (stall: Stall) => {
    setEditingId(stall.id);
    setForm({
      stallName: stall.stallName,
      size: stall.size,
      status: stall.status,
      description: stall.description,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await api.delete(`http://localhost:8087/api/stalls/${confirmDeleteId}`);
      toast.success("Stall deleted");
      fetchStalls();
    } catch (err: any) {
      const msg = err?.response?.data?.data || err?.response?.data?.message || err?.message || "Failed to delete";
      toast.error(msg);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Manage Stalls</h2>
          <p className="text-sm text-gray-600">View, create, and update stall details.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Stall
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64 focus:border-indigo-500 focus:outline-none"
            placeholder="Search name, status, description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-500">{filtered.length} stalls</span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading stalls...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((stall) => (
                  <tr key={stall.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{stall.stallName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold">
                        {stall.size}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                        {stall.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xl truncate">{stall.description}</td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        className="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100"
                        onClick={() => handleEdit(stall)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(stall.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No stalls found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showForm || editingId !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-100 p-5 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={resetForm}
              aria-label="Close form"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {editingId ? "Edit Stall" : "Create Stall"}
            </h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stall Name</label>
                <input
                  required
                  value={form.stallName}
                  onChange={(e) => setForm({ ...form, stallName: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="SMALL">SMALL</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LARGE">LARGE</option>
                  </select>
                </div>
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete stall?</h4>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStallManagement;
