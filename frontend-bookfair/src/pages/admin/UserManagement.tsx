
import React, { useMemo, useState } from "react";
import {
  FaBook,
  FaStore,
  FaUsers,
  FaBan,
  FaSearch,
  FaPlus,
  FaUserTie,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdBadge,
  FaTags,
  FaTicketAlt,
  FaEye,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

type UserType = "PUBLISHER" | "VENDOR";
type UserStatus = "ACTIVE" | "PENDING" | "BLOCKED";

type PubVendor = {
  id: string;
  type: UserType;
  name: string;             // Organization / Brand name
  contactPerson: string;
  email: string;
  phone: string;
  genres: string[];
  address?: string;
  website?: string;
  registrationNo?: string;
  totalStalls?: number;
  status: UserStatus;
  notes?: string;
};

const MOCK_USERS: PubVendor[] = [
  {
    id: "PV-001",
    type: "PUBLISHER",
    name: "Lake House Publishers",
    contactPerson: "Nimal Perera",
    email: "contact@lakehouse.lk",
    phone: "+94 77 123 4567",
    genres: ["School Textbooks", "Children", "Fiction"],
    address: "Colombo 10, Sri Lanka",
    website: "https://lakehouse.lk",
    registrationNo: "REG-2025-001",
    totalStalls: 3,
    status: "ACTIVE",
    notes: "Returning publisher, priority for main hall.",
  },
  {
    id: "PV-002",
    type: "PUBLISHER",
    name: "Sarasavi Publishers",
    contactPerson: "Tharindu Silva",
    email: "sales@sarasavi.lk",
    phone: "+94 71 555 8899",
    genres: ["Academic", "Novels", "Comics"],
    address: "Nugegoda, Sri Lanka",
    website: "https://sarasavi.lk",
    registrationNo: "REG-2025-002",
    totalStalls: 2,
    status: "PENDING",
  },
  {
    id: "PV-003",
    type: "VENDOR",
    name: "Book Accessories Lanka",
    contactPerson: "Ishara Gunasekara",
    email: "info@bookaccessories.lk",
    phone: "+94 76 222 3344",
    genres: ["Stationery", "Bookmarks", "Gift Items"],
    address: "Kandy, Sri Lanka",
    totalStalls: 1,
    status: "ACTIVE",
  },
  {
    id: "PV-004",
    type: "PUBLISHER",
    name: "Knowledge Tree",
    contactPerson: "Kasun Jayasuriya",
    email: "hello@knowledgetree.lk",
    phone: "+94 77 909 8080",
    genres: ["Higher Education", "Engineering", "IT"],
    address: "Galle Road, Colombo 4",
    totalStalls: 4,
    status: "BLOCKED",
    notes: "Payment issues from last event.",
  },
];

const ALL_GENRES = [
  "School Textbooks",
  "Children",
  "Fiction",
  "Academic",
  "Novels",
  "Comics",
  "Stationery",
  "Bookmarks",
  "Gift Items",
  "Higher Education",
  "Engineering",
  "IT",
];

const statusColors: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
};

const typeColors: Record<UserType, string> = {
  PUBLISHER: "bg-indigo-50 text-indigo-700 border-indigo-200",
  VENDOR: "bg-sky-50 text-sky-700 border-sky-200",
};

const UserManagement: React.FC = () => {
  const [data, setData] = useState<PubVendor[]>(MOCK_USERS);


  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | UserType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");
  const [genreFilter, setGenreFilter] = useState<string>("ALL");


  const [selected, setSelected] = useState<PubVendor | null>(null);


  const stats = useMemo(() => {
    const total = data.length;
    const publishers = data.filter((u) => u.type === "PUBLISHER").length;
    const vendors = data.filter((u) => u.type === "VENDOR").length;
    const active = data.filter((u) => u.status === "ACTIVE").length;
    const blocked = data.filter((u) => u.status === "BLOCKED").length;
    return { total, publishers, vendors, active, blocked };
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((u) => {
      const term = search.trim().toLowerCase();

      if (term) {
        const inText =
          u.name.toLowerCase().includes(term) ||
          u.contactPerson.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.genres.some((g) => g.toLowerCase().includes(term));
        if (!inText) return false;
      }

      if (typeFilter !== "ALL" && u.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
      if (genreFilter !== "ALL" && !u.genres.includes(genreFilter)) return false;

      return true;
    });
  }, [data, search, typeFilter, statusFilter, genreFilter]);

  const handleStatusChange = (id: string, status: UserStatus) => {
    setData((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this publisher/vendor?")) return;
    setData((prev) => prev.filter((u) => u.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-indigo-600" />
            Publishers & Vendors Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all registered publishers and vendors, including their contact details
            and the genres they plan to sell at the book fair.
          </p>
        </div>
       
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-900 text-white">
            <FaUsers />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Registrations</p>
            <p className="mt-1 text-2xl font-semibold text-gray-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-full bg-indigo-600 text-white">
            <FaBook />
          </div>
          <div>
            <p className="text-xs text-gray-500">Publishers</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-700">
              {stats.publishers}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-full bg-sky-600 text-white">
            <FaStore />
          </div>
          <div>
            <p className="text-xs text-gray-500">Vendors</p>
            <p className="mt-1 text-2xl font-semibold text-sky-700">{stats.vendors}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-800 text-white flex items-center justify-center">
            <FaTicketAlt />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active / Blocked</p>
            <p className="mt-1 text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-emerald-600">{stats.active} active</span>
              <span className="text-gray-400">/</span>
              <span className="inline-flex items-center gap-1 text-red-600">
                <FaBan className="text-[11px]" />
                {stats.blocked} blocked
              </span>
            </p>
          </div>
        </div>
      </div>

  
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search (name, contact person, email, genre)
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search publishers/vendors..."
                className="w-full border border-gray-300 rounded-md pl-9 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute left-2 top-2 text-gray-400">
                <FaSearch className="h-4 w-4" />
              </span>
            </div>
          </div>

       
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All</option>
              <option value="PUBLISHER">Publisher</option>
              <option value="VENDOR">Vendor</option>
            </select>
          </div>

        
          <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-1 md:col-start-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All</option>
                {ALL_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>
            Showing <b>{filtered.length}</b> of <b>{data.length}</b> records
          </span>
          {search || typeFilter !== "ALL" || statusFilter !== "ALL" || genreFilter !== "ALL" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setStatusFilter("ALL");
                setGenreFilter("ALL");
              }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

    
      <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-4 items-start">
    
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Genres
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Stalls
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-xs text-gray-500"
                    >
                      No publishers or vendors found for the selected filters.
                    </td>
                  </tr>
                )}

                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelected(u)}
                        className="text-xs font-semibold text-indigo-700 hover:underline text-left flex items-center gap-1"
                      >
                        <FaBook className="text-[11px] text-gray-400" />
                        {u.name}
                      </button>
                      <div className="text-[11px] text-gray-500">
                        ID: {u.id}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={[
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium",
                          typeColors[u.type],
                        ].join(" ")}
                      >
                        {u.type === "PUBLISHER" ? <FaBook /> : <FaStore />}
                        {u.type === "PUBLISHER" ? "Publisher" : "Vendor"}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-800 font-medium flex items-center gap-1">
                        <FaUserTie className="text-gray-400" />
                        {u.contactPerson}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[180px] flex items-center gap-1">
                        <FaEnvelope className="text-gray-400" />
                        {u.email}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <FaPhoneAlt className="text-gray-400" />
                        {u.phone}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {u.genres.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]"
                          >
                            <FaTags className="text-[10px] text-gray-400" />
                            {g}
                          </span>
                        ))}
                        {u.genres.length > 3 && (
                          <span className="text-[11px] text-gray-500">
                            +{u.genres.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-xs text-gray-700">
                      {u.totalStalls ?? "-"}
                    </td>

                    <td className="px-3 py-2">
                      <select
                        value={u.status}
                        onChange={(e) =>
                          handleStatusChange(u.id, e.target.value as UserStatus)
                        }
                        className={[
                          "border rounded-full px-2 py-0.5 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500",
                          statusColors[u.status],
                        ].join(" ")}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="BLOCKED">BLOCKED</option>
                      </select>
                    </td>

                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelected(u)}
                          className="px-2 py-1 rounded-md border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-100 inline-flex items-center gap-1"
                        >
                          <FaEye />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => alert("TODO: open edit form")}
                          className="px-2 py-1 rounded-md border border-indigo-500 text-[11px] text-indigo-700 hover:bg-indigo-50 inline-flex items-center gap-1"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="px-2 py-1 rounded-md border border-red-500 text-[11px] text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm min-h-[220px] p-4">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-500 text-center">
              Select a publisher or vendor from the table to view full details, contact
              information, and their planned genres.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <FaBook className="text-indigo-600" />
                      {selected.name}
                    </h2>
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium",
                        typeColors[selected.type],
                      ].join(" ")}
                    >
                      {selected.type === "PUBLISHER" ? <FaBook /> : <FaStore />}
                      {selected.type === "PUBLISHER" ? "Publisher" : "Vendor"}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
                    <FaIdBadge className="text-gray-400" />
                    ID: {selected.id}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <FaUserTie className="text-gray-400" />
                    Contact person
                  </div>
                  <div>{selected.contactPerson}</div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="text-gray-400" />
                      {selected.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaPhoneAlt className="text-gray-400" />
                      {selected.phone}
                    </span>
                  </div>
                </div>

                {selected.address && (
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-500" />
                      Address
                    </div>
                    <div className="text-gray-700">{selected.address}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {selected.website && (
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        <FaGlobe className="text-gray-400" />
                        Website
                      </div>
                      <a
                        href={selected.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-600 hover:underline break-all"
                      >
                        {selected.website}
                      </a>
                    </div>
                  )}
                  {selected.registrationNo && (
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        <FaIdBadge className="text-gray-400" />
                        Registration No.
                      </div>
                      <div>{selected.registrationNo}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <FaTags className="text-gray-400" />
                    Genres to be sold
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selected.genres.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]"
                      >
                        <FaBook className="text-[10px] text-gray-400" />
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      <FaTicketAlt className="text-gray-400" />
                      Total stalls
                    </div>
                    <div>{selected.totalStalls ?? "-"}</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      <FaBan className="text-gray-400" />
                      Status
                    </div>
                    <span
                      className={[
                        "inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium",
                        statusColors[selected.status],
                      ].join(" ")}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>

                {selected.notes && (
                  <div>
                    <div className="font-semibold mb-1">Internal notes</div>
                    <p className="text-[11px] text-gray-600">{selected.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => alert("TODO: open edit form")}
                  className="px-3 py-1.5 rounded-md border border-indigo-500 text-[11px] text-indigo-700 hover:bg-indigo-50 inline-flex items-center gap-1"
                >
                  <FaEdit />
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={() => alert("TODO: link to stall reservations page for this user")}
                  className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-[11px] hover:bg-black inline-flex items-center gap-1"
                >
                  <FaTicketAlt />
                  View stall reservations
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
