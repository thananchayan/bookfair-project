import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Topbar from "../Components/Admin-Topbar"

const AdminLayout = () => {
  //const navigate = useNavigate();

  // const handleLogout = () => {
  //   // later you can clear auth tokens here
  //   navigate("/adminlogin");
  // };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">BookFair Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block p-2 rounded hover:bg-blue-100">
            Dashboard
          </Link>
          <Link to="/admin/stalls" className="block p-2 rounded hover:bg-blue-100">
            Stalls
          </Link>
          <Link to="/admin/reservations" className="block p-2 rounded hover:bg-blue-100">
            Reservations
          </Link>
          <Link to="/admin/publishers" className="block p-2 rounded hover:bg-blue-100">
            Publishers
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <Topbar/>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
