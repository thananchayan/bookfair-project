import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const SiteLayout: React.FC = () => (
  <div className="app-shell">
    <Navbar fixed />
    <main className="site-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default SiteLayout;
