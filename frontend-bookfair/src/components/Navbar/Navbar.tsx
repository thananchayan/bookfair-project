import React, { useEffect, useState } from "react";
import "./Navbar.css";


import BFLogoA from "../../assets/BFLogoA.png";


type NavbarProps = {
  bigLogoSrc?: string;   
  smallLogoSrc?: string; 
  logoAlt?: string;
  brand?: string;
  onLogin?: () => void;
  loginText?: string;
  fixed?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
  bigLogoSrc = BFLogoA,
  smallLogoSrc = BFLogoA,
  logoAlt = "Brand logo",

  onLogin,
  loginText = "Login",
  fixed = true,
}) => {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => (onLogin ? onLogin() : (window.location.href = "/login"));

  return (
    <header className={`nav-wrapper ${fixed ? "nav-fixed" : ""} ${elevated ? "nav-elevated" : ""}`}>
      <nav className="nav nav--minimal" aria-label="Top navigation">
  
        <a className="nav-brand" href="/" aria-label="Homepage">
     
          <img className="nav-logo nav-logo--sm" src={smallLogoSrc} alt={logoAlt} />
      
          <img className="nav-logo nav-logo--lg" src={bigLogoSrc} alt={logoAlt} />
          
        </a>

        
        <div className="nav-actions">
          <button className="btn-login" onClick={handleLogin}>{loginText}</button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
