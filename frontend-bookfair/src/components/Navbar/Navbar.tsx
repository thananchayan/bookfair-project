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

const SAMPLE_USER = {
  name: "Silva",
  email: "silva@example.com",
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

  // Mock auth state (derived from route for now)
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState(SAMPLE_USER.name);

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

  // 🔧 Mock: whenever we navigate, pretend we're logged in on non-auth pages
  useEffect(() => {
    if (isAuthPage) {
      setLoggedIn(false);
      setUserName(""); // hide on auth pages
    } else {
      setLoggedIn(true);
      setUserName(SAMPLE_USER.name);
    }
  }, [isAuthPage]);

  const buttonText = isAuthPage ? "Login" : "Logout";

  const handleAuth = () => {
    if (isAuthPage) {
      navigate("/login");
      return;
    }
    // Mock logout then go home
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
          {/* Show sample username on all non-auth pages */}
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
