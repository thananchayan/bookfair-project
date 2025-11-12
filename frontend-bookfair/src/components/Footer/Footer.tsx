import React from "react";
import "./footer.css";

const Footer: React.FC = () => (
  <footer className="footer">© {new Date().getFullYear()}Colombo International BookFair • All rights reserved.</footer>
);

export default Footer;
