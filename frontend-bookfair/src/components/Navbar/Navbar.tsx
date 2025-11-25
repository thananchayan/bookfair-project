import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import BFLogoA from "../../assets/BFLogoA.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";

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
  const dispatch = useAppDispatch();
  const { username, profile, token } = useAppSelector((s) => s.auth);
  const [elevated, setElevated] = useState(false);

  const loggedIn = Boolean(token);
  const displayName =  username || "";

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const buttonText = isAuthPage ? "Login" : "Logout";

  const handleAuth = () => {
    if (isAuthPage) {
      navigate("/login");
      return;
    }
    dispatch(logout());
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
          {!isAuthPage && loggedIn && displayName && (
            <span className="text-gray-700 font-medium hidden sm:inline">
              {displayName}
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
