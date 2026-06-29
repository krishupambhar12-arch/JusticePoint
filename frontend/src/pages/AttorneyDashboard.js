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
  const [earnings, setEarnings] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
  const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState([]);

  // Test mode - remove this after debugging
  const TEST_MODE = false;
  if (TEST_MODE) {
    setLoading(false);
    setAttorney({ name: "Test Attorney" });
    setTodayAppointments(5);
    setTotalPatients(12);
    setEarnings(15000);
    setRecentAppointments([]);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // Listen for new appointment bookings
    const handleNewAppointment = (e) => {
      console.log("New appointment detected, refreshing dashboard...");
      console.log("Event details:", e.detail);
      fetchDashboard(); // Refresh dashboard data
    };

    // Add event listener for new appointment bookings
    window.addEventListener('newAppointmentBooked', handleNewAppointment);

    const fetchDashboard = async () => {
      try {
        console.log("Fetching dashboard data...");
        console.log("API URL:", API.ATTORNEY_DASHBOARD);
        console.log("Token:", token ? "Present" : "Missing");
        
        const res = await fetch(API.ATTORNEY_DASHBOARD, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);
        
        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        console.log("Content type:", contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Server error. Please try again later.');
        }
        
        const data = await res.json();
        console.log("Raw response data:", data);
        
        if (res.ok) {
          console.log("Dashboard attorney data:", data.attorney);
          console.log("Dashboard stats data:", data.stats);
          console.log("Today's appointments:", data.stats?.todayAppointments);
          console.log("Total clients:", data.stats?.totalClients);
          console.log("Upcoming appointments:", data.stats?.upcomingAppointments);
          console.log("Earnings:", data.stats?.earnings);

            // Save attorney data for profile page
              localStorage.setItem("attorneyData", JSON.stringify(data.attorney));

          setAttorney(data.attorney);
          console.log("Setting todayAppointments to:", data.stats?.todayAppointments || 0);
          setTodayAppointments(data.stats?.todayAppointments || 0);
          console.log("Setting totalPatients to:", data.stats?.totalClients || 0);
          setTotalPatients(data.stats?.totalClients || 0);
          console.log("Upcoming appointments count:", data.stats?.upcomingAppointments || 0);
          console.log("Setting earnings to:", data.stats?.earnings || 0);
          setEarnings(data.stats?.earnings || 0);
          
          // Fetch recent appointments
          await fetchRecentAppointments(token);
          setLoading(false); // Set loading to false after successful data fetch
        } else {
          // Check if force logout is required
          if (data.forceLogout || data.deactivated) {
            console.log("Force logout required - clearing session");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            alert("Your account has been deactivated by admin. You have been logged out.");
            navigate("/login");
            return;
          }
          setError(data.message || "Failed to load dashboard");
          setLoading(false);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      }
    };

    const categorizeAppointments = (appointments) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      const todayAppts = [];
      const upcomingAppts = [];
      
      appointments.forEach(appt => {
        const apptDate = new Date(appt.date);
        apptDate.setHours(0, 0, 0, 0);
        
        if (apptDate.getTime() === today.getTime()) {
          todayAppts.push(appt);
        } else if (apptDate.getTime() > today.getTime()) {
          upcomingAppts.push(appt);
        }
      });
      
      return { todayAppts, upcomingAppts };
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
        
        // Categorize appointments into today and upcoming
        const { todayAppts, upcomingAppts } = categorizeAppointments(data.appointments);
        setTodayAppointmentsList(todayAppts);
        setUpcomingAppointmentsList(upcomingAppts);
        
        // Extract unique clients from all appointments
        const uniqueClients = new Map();
        data.appointments.forEach(appt => {
          const clientKey = appt.patient?.email || appt.clientEmail || '';
          if (clientKey && !uniqueClients.has(clientKey)) {
            uniqueClients.set(clientKey, {
              name: appt.patient?.name || appt.client || 'Unknown Client',
              email: appt.patient?.email || appt.clientEmail || '',
              phone: appt.patient?.phone || appt.clientPhone || '',
              totalAppointments: 1,
              lastAppointment: appt.date
            });
          } else if (clientKey && uniqueClients.has(clientKey)) {
            const existingClient = uniqueClients.get(clientKey);
            existingClient.totalAppointments += 1;
            // Update last appointment if this one is more recent
            if (new Date(appt.date) > new Date(existingClient.lastAppointment)) {
              existingClient.lastAppointment = appt.date;
            }
          }
        });
        
        console.log("Unique clients found:", Array.from(uniqueClients.values()));
        const clientList = Array.from(uniqueClients.values());
        
        // Sort clients by last appointment date (most recent first)
        clientList.sort((a, b) => {
          const dateA = new Date(a.lastAppointment || '1970-01-01');
          const dateB = new Date(b.lastAppointment || '1970-01-01');
          return dateB.getTime() - dateA.getTime(); // Descending order (recent first)
        });
        
        setAllClients(clientList);
        
        // Update totalPatients to match actual client count
        setTotalPatients(clientList.length);
      } else {
        console.error("Failed to fetch recent appointments");
      }
    } catch (error) {
      console.error("Error fetching recent appointments:", error);
    }
  };

  fetchDashboard();

  // Cleanup event listener on component unmount
  return () => {
    window.removeEventListener('newAppointmentBooked', handleNewAppointment);
  };
  }, []);

  // Debug: Log state changes
  useEffect(() => {
    console.log("State updated:");
    console.log("  - loading:", loading);
    console.log("  - error:", error);
    console.log("  - attorney:", attorney);
    console.log("  - todayAppointments:", todayAppointments);
    console.log("  - totalPatients:", totalPatients);
        console.log("  - earnings:", earnings);
  }, [loading, error, attorney, todayAppointments, totalPatients, earnings]);

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
              <h1>Welcome Attorney {attorney?.attorneyName || attorney?.name || 'Attorney'} 👋</h1>
              <p>You have {todayAppointments} appointments today.</p>
            </>
          )}
        </div>

        
        <div className="stats-cards">
          <div className="card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2>Total Users</h2>
            <p>{totalPatients || 0}</p>
            <small>Active clients</small>
          </div>
          <div className="card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h2>Upcoming Appointments</h2>
            <p>{upcomingAppointmentsList.length || 0}</p>
            <small>Scheduled</small>
          </div>
          <div className="card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3h12M6 8h12M8 8c0 4 4 4 4 8v2"></path>
              </svg>
            </div>
            <h2>Earnings</h2>
            <p>&#8377;{earnings.toLocaleString() || 0}</p>
            <small>From completed appointments</small>
          </div>
        </div>

        {/* Today's Appointments Section */}
        {/* <div className="todays-appointments">
          <div className="section-header">
            <h3>Today's Appointments</h3>
            <span className="appointment-count-badge">{todayAppointmentsList.length}</span>
          </div>
          {todayAppointmentsList.length > 0 ? (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Date & Time</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointmentsList.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="client-name">
                        <strong>{appointment.patient?.name || appointment.client || 'Unknown Client'}</strong>
                      </td>
                      <td className="appointment-datetime">
                        <div>
                          <strong>{appointment.date}</strong>
                          <br />
                          <small>{appointment.time}</small>
                        </div>
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
              <p>No appointments scheduled for today</p>
            </div>
          )}
        </div>

        
    
        <div className="all-clients">
          <div className="section-header">
            <h3>All Clients</h3>
            <span className="client-count">Total: {allClients.length} clients</span>
          </div>
          {allClients.length > 0 ? (
            <div className="clients-table-container">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Appointments</th>
                    <th>Last Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {allClients.map((client, index) => (
                    <tr key={index}>
                      <td className="client-name">
                        <strong>{client.name}</strong>
                      </td>
                      <td className="client-email">
                        {client.email || 'N/A'}
                      </td>
                      <td className="client-phone">
                        {client.phone || 'N/A'}
                      </td>
                      <td className="total-appointments">
                        <span className="appointment-count">{client.totalAppointments}</span>
                      </td>
                      <td className="last-appointment">
                        {client.lastAppointment || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-clients">
              <p>No clients found</p>
              <button 
                onClick={() => navigate('/attorney/appointments')} 
                className="view-all-btn"
              >
                Manage Appointments
              </button>
            </div>
          )}
        </div> */}

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
                        <strong>{appointment.patient?.name || appointment.client || 'Unknown Client'}</strong>
                      </td>
                      <td className="client-email">
                        {appointment.patient?.email || appointment.clientEmail || 'N/A'}
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
