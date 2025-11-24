import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/publisher/Welcompage/WelcomePage";
import StallMap from "./components/bookinginterface/BookingInterface";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import SiteLayout from "./layouts/SiteLayout";
import "./App.css";
import PublisherDashboard from "./pages/publisher/PublisherDashboard";
import PublisherLayout from "./layouts/PublisherLayout";
import ReserveStall from "./pages/publisher/BookingInterface/BookingInterface";
import ProfileSettings from "./pages/publisher/Profile/Profile";
import Dashboard from "./pages/admin/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import RecentReservations from "./pages/admin/RecentReservations";
import AdminLayout from "./layouts/OrganizerLayout";
import Reservations from "./pages/admin/Reservation-Manage";
import CreateStalls from "./pages/admin/StallsManagement";
import LoginPageAdmin from "./pages/auth/LoginPageAdmin";
import AdminStallManagement from "./pages/admin/StallsManagement";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="stall-map" element={<StallMap />} />


        <Route path="publisher" element={<PublisherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PublisherDashboard />} />
          <Route path="reserve-stall" element={<ReserveStall />} />
          <Route path="profile" element={<ProfileSettings />} />



        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="recentreservations" element={<RecentReservations />} />
          <Route path="createstalls" element={<AdminStallManagement />} />
          <Route path="usermanagement" element={<UserManagement />} />



        </Route>
        <Route path="admin" element={<Dashboard />} />
      </Route>
      <Route path="loginadmin" element={<LoginPageAdmin />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
