import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

interface UserRow {
  id: number;
  username: string;
  phonenumber: string | null;
  address: string | null;
  profession: string | null;
  date: string | null;
}

interface PagedUsers {
  data: {
    content: UserRow[];
  };
}

const UserManagement: React.FC = () => {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    api
      .get<PagedUsers>("http://localhost:8087/api/users?page=0&size=20")
      .then((res) => {
        const content = res.data?.data?.content || [];
        const filtered = content.filter((u) => (u.profession || "").toUpperCase() !== "ADMIN");
        setRows(filtered);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to load users";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    setDeleteLoading(true);
    try {
      await api.delete(`http://localhost:8087/api/users/${confirmDeleteId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete user";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Publishers and vendors (excluding admins)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-900 text-white">
              <tr>
                {["ID", "Username", "Phone", "Address", "Profession", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-rose-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                rows.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{u.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{u.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{u.phonenumber || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{u.address || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-semibold">
                        {u.profession || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{u.date || "-"}</td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button
                        className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(u.id)}
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete user?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. Are you sure you want to delete user ID: {confirmDeleteId}?
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
                disabled={deleteLoading}
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

export default UserManagement;
