// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // dashboard icon
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const goToDashboard = () => {
    const isClient = role === "Client";

    if (isClient) {
      navigate("/client/dashboard");
    } else {
      navigate("/"); // fallback to home
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="logo">Justice Point</div>
      <nav>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/our-rights">Our Rights</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </nav>

      <div className="header-actions">
        {role ? (
          <>
            <FaUserCircle
              className="profile-icon"
              onClick={goToDashboard}
            />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
