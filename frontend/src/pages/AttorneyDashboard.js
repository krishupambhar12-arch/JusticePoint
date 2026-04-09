// src/pages/DoctorDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/AttorneySidebar";
import "../styles/doctorDashboard.css";
import { API } from "../config/api";

const AttorneyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attorney, setAttorney] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(API.ATTORNEY_DASHBOARD, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Server error. Please try again later.');
        }
        
        const data = await res.json();
        
        if (res.ok) {
          console.log("🔍 Dashboard attorney data:", data.attorney);
          console.log("Dashboard stats data:", data.stats);

            // Save attorney data for profile page
              localStorage.setItem("attorneyData", JSON.stringify(data.attorney));

          setAttorney(data.attorney);
          setTodayAppointments(data.stats?.todayAppointments || 0);
          setTotalPatients(data.stats?.totalClients || 0);
          setUpcomingAppointments(data.stats?.upcomingAppointments || 0);
          setEarnings(data.stats?.earnings || 0);
          
          // Fetch recent appointments
          await fetchRecentAppointments(token);
        } else {
          // Check if force logout is required
          if (data.forceLogout || data.deactivated) {
            console.log("🔍 Force logout required - clearing session");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            alert("Your account has been deactivated by admin. You have been logged out.");
            navigate("/login");
            return;
          }
          setError(data.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentAppointments = async (token) => {
    try {
      const res = await fetch(API.ATTORNEY_APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Recent appointments data:", data.appointments);
        
        // Get last 5 appointments, sorted by date (most recent first)
        const recent = data.appointments
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        setRecentAppointments(recent);
      } else {
        console.error("Failed to fetch recent appointments");
      }
    } catch (error) {
      console.error("Error fetching recent appointments:", error);
    }
  };

  fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          {loading ? (
            <>
              <h1>Loading dashboard…</h1>
              <p>Please wait</p>
            </>
          ) : error ? (
            <>
              <h1>Welcome</h1>
              <p style={{ opacity: 0.9 }}>{error}</p>
            </>
          ) : (
            <>
              <h1>Welcome Attorney {attorney?.name || 'Attorney'} 👋</h1>
              <p>You have {todayAppointments} appointments today.</p>
            </>
          )}
        </div>

        
        <div className="stats-cards">
          <div className="card">
            <h2>Total Users</h2>
            <p>{totalPatients}</p>
          </div>
          <div className="card">
            <h2>Upcoming Appointments</h2>
            <p>{upcomingAppointments}</p>
          </div>
          <div className="card">
            <h2>Earnings</h2>
            <p>₹{earnings}</p>
          </div>
        </div>

        {/* Recent Appointments Section */}
        <div className="recent-appointments">
          <div className="section-header">
            <h3>Recent Appointments</h3>
            {recentAppointments.length > 0 && (
              <button 
                onClick={() => navigate('/attorney/appointments')} 
                className="view-all-btn"
              >
                View All Appointments
              </button>
            )}
          </div>
          {recentAppointments.length > 0 ? (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="client-name">
                        <strong>{appointment.personalInfo?.name || 'Unknown Client'}</strong>
                      </td>
                      <td className="client-email">
                        {appointment.personalInfo?.email || 'N/A'}
                      </td>
                      <td className="appointment-date">
                        {appointment.date}
                      </td>
                      <td className="appointment-time">
                        {appointment.time}
                      </td>
                      <td className="appointment-subject">
                        {appointment.subject || 'No subject'}
                      </td>
                      <td className="appointment-status">
                        <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-appointments">
              <p>No recent appointments found</p>
              <button 
                onClick={() => navigate('/attorney/appointments')} 
                className="view-all-btn"
              >
                Manage Appointments
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AttorneyDashboard;
