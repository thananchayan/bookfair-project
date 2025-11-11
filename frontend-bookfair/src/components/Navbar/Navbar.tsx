import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import BFLogoA from "../../assets/BFLogoA.png";

type NavbarProps = {
  bigLogoSrc?: string;
  smallLogoSrc?: string;
  logoAlt?: string;
  fixed?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
  bigLogoSrc = BFLogoA,
  smallLogoSrc = BFLogoA,
  logoAlt = "Brand logo",
  fixed = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [elevated, setElevated] = useState(false);

  // MOCK auth state (replace with real auth later)
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages where we want "Login" (and hide username)
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  // Button label driven by page type
  const buttonText = isAuthPage ? "Login" : "Logout";

  const handleAuth = () => {
    if (isAuthPage) {
      // Always go to login on these pages
      navigate("/login");
      return;
    }
    // On all other pages: treat as logout
    setLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <header className={`nav-wrapper ${fixed ? "nav-fixed" : ""} ${elevated ? "nav-elevated" : ""}`}>
      <nav className="nav nav--minimal" aria-label="Top navigation">
        <Link className="nav-brand" to="/" aria-label="Homepage">
          <img className="nav-logo nav-logo--sm" src={smallLogoSrc} alt={logoAlt} />
          <img className="nav-logo nav-logo--lg" src={bigLogoSrc} alt={logoAlt} />
        </Link>

        <div className="nav-actions flex items-center gap-4">
          {/* Show username on all non-auth pages, only if logged in */}
          {!isAuthPage && loggedIn && (
            <span className="text-gray-700 font-medium hidden sm:inline">
              {userName}
            </span>
          )}

          <button className="btn-login" onClick={handleAuth}>
            {buttonText}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
