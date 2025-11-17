
import React,  { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

import Stalls from "./Pages/Stalls_Manage";
import Reservations from "./Pages/Reservation-Manage";
import Publishers from "./Pages/Publisher-Manage";
import Login from "./Pages/Admin-Login";
import Dashboard from "./Pages/Admin_Dashboard/Dashboard";
import AdminLayout from "./Layouts/AdminLayout";
import { isAdminLoggedIn } from "./lib/auth";
import "./App.css";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAdminLoggedIn() ? <>{children}</> : <Navigate to="/adminlogin" replace />;
};

const router = createBrowserRouter([
  {
    path: "/adminlogin",
    element: <Login/>,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "stalls", element: <Stalls /> },
      { path: "reservations", element: <Reservations /> },
      { path: "publishers", element: <Publishers /> },
    ],
  },
 
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


