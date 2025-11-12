// src/components/Navbar/AppSubNavbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

const mockPublisherUser = {
  role: "publisher" as const,
  name: "Demo Publisher",
};

export default function AppSubNavbar() {
  const [open, setOpen] = useState(false);
  const user = mockPublisherUser;

  const publisherLinks = [
    { to: "/publisher/dashboard", label: "Dashboard" },
    { to: "/publisher/reserve-stall", label: "Reservations" },
    { to: "/publisher/profile", label: "Profile" },
  ];

  if (!user) return null;

  return (
    <nav
      className="w-full bg-gray-50 border-b border-gray-200 sticky top-18 z-30"
      aria-label="Secondary"
    >
      <div className="mx-auto max-w-7xl px-4 h-11 flex items-center justify-between">
        {/* Desktop tabs */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {publisherLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  [
                    "px-1 py-2 font-medium transition-colors",
                    isActive
                      ? "text-indigo-700 border-b-2 border-indigo-600"
                      : "hover:text-indigo-700",
                  ].join(" ")
                }
                end
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger (right side) */}
        <div className="md:hidden ml-auto">
          <button
            type="button"
            aria-label="Open sub navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>


      <div
        className={[
          "md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out bg-gray-50 border-t border-gray-200",
          open ? "max-h-48" : "max-h-0",
        ].join(" ")}
      >
        <ul className="px-4 py-2 space-y-1 text-sm">
          {publisherLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "block px-2 py-2 rounded-md",
                    isActive
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")
                }
                end
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
