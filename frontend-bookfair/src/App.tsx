import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/publisher/Welcompage/WelcomePage";
import StallMap from "./components/bookinginterface/BookingInterface";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import SiteLayout from "./layouts/SiteLayout";
import "./App.css";
import PublisherDashboard from "./pages/publisher/PublisherDashboard";
import PublisherLayout from "./layouts/PublisherLayout";
// Optional future pages
// import PublisherReservations from "./pages/publisher/Reservations";
// import PublisherProfile from "./pages/publisher/Profile";
// import ReserveStall from "./pages/publisher/ReserveStall";

function App() {
  return (
    <Routes>
      {/* Public shell with top navbar, footer, etc. */}
      <Route element={<SiteLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="stall-map" element={<StallMap />} />

        {/* Publisher area */}
        <Route path="publisher" element={<PublisherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PublisherDashboard />} />
          {/* 
          <Route path="reservations" element={<PublisherReservations />} />
          <Route path="profile" element={<PublisherProfile />} />
          <Route path="reserve-stall" element={<ReserveStall />} />
          */}
        </Route>
      </Route>

      {/* Auth (kept outside SiteLayout if you want a minimal auth page) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
