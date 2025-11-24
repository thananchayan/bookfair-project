import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

interface BookFair {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  organizer: string;
  location: string;
  durationDays: number;
  description: string;
  status: string;
}

type FormState = Omit<BookFair, "id" | "status"> & { status?: string };

const emptyForm: FormState = {
  name: "",
  startDate: "",
  endDate: "",
  organizer: "",
  location: "",
  durationDays: 0,
  description: "",
  status: "UPCOMING",
};

const ReservationManage: React.FC = () => {
  const [bookFairs, setBookFairs] = useState<BookFair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  const fetchBookFairs = () => {
    setLoading(true);
    setError(null);
    api
      .get("http://localhost:8087/api/bookfairs/getAll")
      .then((res) => setBookFairs(res.data?.data || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load book fairs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookFairs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookFairs.filter((bf) => {
      const matchesSearch =
        bf.name.toLowerCase().includes(q) ||
        bf.organizer.toLowerCase().includes(q) ||
        bf.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter ? bf.status.toLowerCase() === statusFilter.toLowerCase() : true;
      return matchesSearch && matchesStatus;
    });
  }, [bookFairs, search, statusFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.organizer.trim() || !form.location.trim()) {
      toast.error("Name, organizer, and location are required.");
      return false;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Please provide start and end dates.");
      return false;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date cannot be before start date.");
      return false;
    }
    if (form.durationDays < 0) {
      toast.error("Duration must be zero or greater.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingId && !confirmUpdateOpen) {
      setConfirmUpdateOpen(true);
      return;
    }
    await doSubmit();
  };

  const doSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`http://localhost:8087/api/bookfairs/${editingId}`, form);
        toast.success("Book fair updated");
      } else {
        await api.post("http://localhost:8087/api/bookfairs", form);
        toast.success("Book fair created");
      }
      resetForm();
      fetchBookFairs();
    } catch (err: any) {
      const msg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save book fair";
      toast.error(msg);
    } finally {
      setConfirmUpdateOpen(false);
    }
  };

  const handleEdit = (bf: BookFair) => {
    setShowForm(true);
    setEditingId(bf.id);
    setForm({
      name: bf.name,
      startDate: bf.startDate,
      endDate: bf.endDate,
      organizer: bf.organizer,
      location: bf.location,
      durationDays: bf.durationDays,
      description: bf.description,
      status: bf.status,
    });
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await api.delete(`http://localhost:8087/api/bookfairs/${confirmDeleteId}`);
      fetchBookFairs();
    } catch (err: any) {
      const msg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete";
      toast.error(msg);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Manage Book Fairs</h2>
          <p className="text-sm text-gray-600">Create, update, and remove upcoming book fairs.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Bookfair
        </button>
      </header>

      <div className="grid gap-6">
        {/* Table card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:border-indigo-500 focus:outline-none"
                placeholder="Search name, organizer, location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">{filtered.length} fairs</span>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading fairs...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Organizer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((bf) => (
                    <tr key={bf.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{bf.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {bf.startDate} - {bf.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{bf.organizer}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{bf.location}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-semibold">
                          {bf.status || "UPCOMING"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm space-x-2">
                        <button
                          className="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100"
                          onClick={() => handleEdit(bf)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => setConfirmDeleteId(bf.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                        No book fairs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
              {editingId ? "Edit Book Fair" : "Create Book Fair"}
            </h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organizer</label>
                <input
                  required
                  value={form.organizer}
                  onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
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

      {confirmUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Update book fair?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Confirm updating this book fair with the current details.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                onClick={() => setConfirmUpdateOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={doSubmit}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete book fair?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. Are you sure you want to delete this book fair?
            </p>
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

export default ReservationManage;
