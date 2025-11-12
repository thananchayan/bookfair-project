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
import ProfileSettings from "./pages/publisher/Profile/profile";

function App() {
  return (
    <Routes>
        <Route element={<SiteLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="stall-map" element={<StallMap />} />

        {/* Publisher area */}
        <Route path="publisher" element={<PublisherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
           <Route path="dashboard" element={<PublisherDashboard />} />
           <Route path="reserve-stall" element={<ReserveStall />} />
         <Route path="profile" element={<ProfileSettings />} />
         
         
          {/* 
          <Route path="reservations" element={<PublisherReservations />} />
          
          */}
        </Route>
      </Route>

       <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
