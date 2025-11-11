
import { Outlet } from "react-router-dom";
import AppSubNavbar from "../components/Navbar/Subnavbar/Subnavbar"; // the subnav you built

export default function PublisherLayout() {
  return (
    <div className="min-h-screen mt-20">
      <AppSubNavbar />
      <main className="mx-auto max-w-7xl py-6">
        <Outlet />
      </main>
    </div>
  );
}
