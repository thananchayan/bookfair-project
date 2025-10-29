import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/common/Button"; // ✅ Make sure this file exists (Button.tsx)

export default function PublisherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- Simulated Demo Mode for testing layout without login ---
  useEffect(() => {
    if (!user) {
      const demoUser = {
        name: "Demo Publisher",
        email: "demo@publisher.com",
        role: "publisher",
      };
      console.log("Demo mode active. Using mock publisher user:", demoUser);
    }
  }, [user]);

  // Use either actual user or demo fallback
  const activeUser = user || {
    name: "Demo Publisher",
    email: "demo@publisher.com",
    role: "publisher",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/publisher/dashboard"
              className="text-2xl font-extrabold text-indigo-600 tracking-tight"
            >
              Colombo Book Fair
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-6">
              <Link
                to="/publisher/dashboard"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/publisher/reservations"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                My Reservations
              </Link>
              <Link
                to="/publisher/profile"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Right Side: User Info + Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Publisher:{" "}
              <span className="font-semibold">{activeUser.name}</span>
            </span>
            <Button
              variant="primary"
              className="text-sm px-3 py-2"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Publisher Portal
        </h1>
        <div className="border border-dashed p-8 rounded-lg bg-gray-100 text-gray-600 text-center">
          <Outlet />
        </div>
      </main>

     
    </div>
  );
}
