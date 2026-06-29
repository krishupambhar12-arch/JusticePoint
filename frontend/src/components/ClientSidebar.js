import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./patientSidebar.css";

const ClientSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear all authentication and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("userId");
      localStorage.removeItem("attorneyId");
      localStorage.removeItem("attorneyData");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminName");
      localStorage.removeItem("redirectAfterLogin");
      
      // Navigate to home page
      navigate("/");
      
      // Force page refresh to clear any remaining state
      window.location.reload();
    }
  };

  return (
    <div className="patient-sidebar">
      <div className="sidebar-menu">
        <h2>Client Panel</h2>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/dashboard" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/profile" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/appointments" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Appointments
            </NavLink>
          </li>
          {/* <li>
            <NavLink 
              to="/client/lab-tests" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Lab Tests
            </NavLink>
          </li> */}
          <li>
            <NavLink 
              to="/client/consultation" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Online Consultation
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/feedback" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Feedback
            </NavLink>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ClientSidebar;

