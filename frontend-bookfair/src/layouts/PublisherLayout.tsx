import React, { useEffect } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { Button } from "../components/common/Button"

export default function PublisherLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // --- Redirect if not authenticated or wrong role ---
  // useEffect(() => {
  //   if (!user || user.role !== "publisher") {
  //     navigate("/auth/login?role=publisher")
      
  //   }
  // }, [user, navigate])

  // // --- Show loading state while checking authentication ---
  // if (!user || user.role !== "publisher") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <p className="text-xl font-medium text-gray-500">
  //         Checking publisher credentials...
  //       </p>
  //     </div>
  //   )
  // }

  // // --- Main layout content ---
  // return (
  //   <div className="min-h-screen bg-gray-50 font-[Inter] flex flex-col">
  //     {/* Top Navigation Bar */}
  //     <nav className="border-b border-gray-200 bg-white shadow-sm">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
  //         {/* Left Side: Logo + Navigation Links */}
  //         <div className="flex items-center gap-8">
  //           <Link
  //             to="/publisher/dashboard"
  //             className="text-2xl font-extrabold text-indigo-600 tracking-tight"
  //           >
  //             Colombo Book Fair
  //           </Link>

  //           {/* Desktop Navigation Links */}
  //           <div className="hidden md:flex gap-6">
  //             <Link
  //               to="/publisher/dashboard"
  //               className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
  //             >
  //               Dashboard
  //             </Link>
  //             <Link
  //               to="/publisher/reservations"
  //               className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
  //             >
  //               My Reservations
  //             </Link>
  //             <Link
  //               to="/publisher/profile"
  //               className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
  //             >
  //               Profile
  //             </Link>
  //           </div>
  //         </div>

  //         {/* Right Side: User Info + Logout */}
  //         <div className="flex items-center gap-4">
  //           <span className="text-sm text-gray-500 hidden sm:block">
  //             Publisher: <span className="font-semibold">{user.name}</span>
  //           </span>
  //           <Button
  //             variant="primary"
  //             size="sm"
  //             onClick={() => {
  //               logout()
  //               navigate("/")
  //             }}
  //           >
  //             Logout
  //           </Button>
  //         </div>
  //       </div>
  //     </nav>

  //     {/* Main Content Area */}
  //     <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <h1 className="text-3xl font-bold text-gray-800 mb-6">
  //         Publisher Portal
  //       </h1>
  //       {/* Nested Route Content */}
  //       <div className="border border-dashed p-8 rounded-lg bg-gray-50 text-gray-600 text-center">
  //         <Outlet />
  //       </div>
  //     </main>

  //     {/* Footer */}
  //     <footer className="w-full text-center py-4 text-xs text-gray-400 border-t mt-12">
  //       CBF Publisher Portal © {new Date().getFullYear()}
  //     </footer>
  //   </div>
  // )

  // --- Temporary Demo Mode: 
  useEffect(() => {
    // ✅ If no user exists, inject a mock publisher for preview purposes
    if (!user) {
      // Simulate a demo user (so no DB needed)
      const demoUser = {
        name: "Demo Publisher",
        email: "demo@publisher.com",
        role: "publisher",
      };

      // You can directly assign this to your auth context if needed
      // But for previewing layout, you can skip navigate entirely
      console.log("Demo mode active. Using mock publisher user:", demoUser);
    }
  }, [user]);

  
  const demoUser = {
    name: "Demo Publisher",
    email: "demo@publisher.com",
    role: "publisher",
  };

  
  const activeUser = user || demoUser;

  
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

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Publisher: <span className="font-semibold">{activeUser.name}</span>
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Publisher Portal
        </h1>
        <div className="border border-dashed p-8 rounded-lg bg-gray-100 text-gray-600 text-center">
          <Outlet />
        </div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-gray-400 border-t mt-12">
        CBF Publisher Portal © {new Date().getFullYear()}
      </footer>
    </div>
  );

}
