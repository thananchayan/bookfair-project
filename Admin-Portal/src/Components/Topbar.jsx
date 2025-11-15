import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear tokens or auth context here
    localStorage.removeItem("admin");
    navigate("/adminlogin");
  };

return (
  <nav className="bg-slate-900 border-b-5 border-indigo-700 shadow-xl sticky top-0 z-80">
    <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
      {/* Title/Logo */}
      <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
        <span className="inline-flex items-center">
          {/* Placeholder for an icon, e.g., <LayoutDashboard className="w-6 h-6 mr-2" /> */}
          📊 Admin Panel
        </span>
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center space-x-7">
        
        {/* Dashboard Link */}
        <Link 
          to="/admin" 
          className="flex items-center text- font-medium text-gray-300 transition duration-200 ease-in-out hover:text-teal-400 hover:scale-105"
        >
          {/* Placeholder icon, e.g., <LayoutDashboard className="w-4 h-4 mr-1" /> */}
          Dashboard
        </Link>
        
        {/* Reservations Link */}
        <Link 
          to="/admin/reservations" 
          className="flex items-center text- font-medium text-gray-300 transition duration-200 ease-in-out hover:text-teal-400 hover:scale-105"
        >
          {/* Placeholder icon, e.g., <Calendar className="w-4 h-4 mr-1" /> */}
          Reservations
        </Link>
        
        {/* Publishers Link */}
        <Link 
          to="/admin/publishers" 
          className="flex items-center text- font-medium text-gray-300 transition duration-200 ease-in-out hover:text-teal-400 hover:scale-105"
        >
          {/* Placeholder icon, e.g., <Users className="w-4 h-4 mr-1" /> */}
          Publishers
        </Link>
        
        {/* Stalls Link */}
        <Link 
          to="/admin/stalls" 
          className="flex items-center text- font-medium text-gray-300 transition duration-200 ease-in-out hover:text-teal-400 hover:scale-105"
        >
          {/* Placeholder icon, e.g., <Briefcase className="w-4 h-4 mr-1" /> */}
          Stalls
        </Link>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 px-4 py-2 text- font-medium text-white bg-red-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {/* Placeholder icon, e.g., <LogOut className="w-4 h-4" /> */}
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
);
};

export default Topbar;
