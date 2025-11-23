
import { Outlet } from "react-router-dom";
import AdminSubNavbar from "../components/Navbar/SubnavbarAdmin/SubnavbarAdmin";

export default function AdminLayout() {
  return (
    <div className="min-h-screen mt-20">
      <AdminSubNavbar />
      <main className="mx-auto max-w-7xl py-6">
        <Outlet />
      </main>
    </div>
  );
}
