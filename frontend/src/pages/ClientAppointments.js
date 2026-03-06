import React, { useState, useEffect } from "react";
import { API } from "../config/api";
import "../styles/patientAppointments.css";
import ClientSidebar from "../components/ClientSidebar";

const ClientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching client appointments...");
      const res = await fetch(API.CLIENT_APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("🔍 Client appointments response:", data);
      console.log("🔍 Number of appointments received:", data.appointments?.length || 0);
      
      if (data.appointments && data.appointments.length > 0) {
        console.log("🔍 Latest appointment:", data.appointments[0]);
        console.log("🔍 Appointment creation times:", data.appointments.map(apt => ({
          id: apt.id,
          date: apt.date,
          time: apt.time,
          createdAt: apt.createdAt,
          subject: apt.subject
        })));
      }
      
      if (!res.ok) throw new Error(data.message || "Failed to load appointments");

      console.log("🔍 Setting appointments:", data.appointments);
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error("❌ Error fetching appointments:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh every 30 seconds to get latest appointments
    const interval = setInterval(fetchAppointments, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <ClientSidebar />
      <div className="appointments-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Appointments</h2>
          <button 
            onClick={fetchAppointments}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <p className="no-appointments">No appointments found.</p>
        ) : (
          <>
            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              Found {appointments.length} appointments
            </p>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Attorney Details</th>
                  <th>Date & Time</th>
                  <th>Subject</th>
                  <th>Purpose</th>
                  <th>Case Summary</th>
                  <th>Status</th>
                  <th>Fees</th>
                  <th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const isRecent = appt.createdAt && 
                    (new Date() - new Date(appt.createdAt)) < 5 * 60 * 1000; // Less than 5 minutes old
                  
                  return (
                    <tr key={appt.id} style={isRecent ? { backgroundColor: '#e8f5e8' } : {}}>
                      <td>
                        <div style={{ maxWidth: '200px' }}>
                          <strong>{appt.doctor?.name || appt.attorneyName || 'Unknown Attorney'}</strong>
                          {appt.doctor?.specialization && (
                            <>
                              <br />
                              <small>{appt.doctor.specialization}</small>
                            </>
                          )}
                          {appt.attorneySpecialization && (
                            <>
                              <br />
                              <small>{appt.attorneySpecialization}</small>
                            </>
                          )}
                          {isRecent && (
                            <div style={{ color: '#28a745', fontSize: '12px', fontWeight: 'bold' }}>
                              🆕 NEW
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{appt.date}</strong>
                          <br />
                          <small>{appt.time}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '150px' }}>
                          <small>{appt.subject || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '120px' }}>
                          <small>{appt.purpose || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '200px' }}>
                          <small>{appt.caseSummary ? `${appt.caseSummary.substring(0, 50)}...` : 'N/A'}</small>
                        </div>
                      </td>
                      <td className={`status status-${appt.status.toLowerCase()}`}>
                        {appt.status}
                      </td>
                      <td>₹{appt.fees || appt.attorneyFees || 0}</td>
                      <td>
                        <small>
                          {appt.createdAt ? 
                            new Date(appt.createdAt).toLocaleTimeString() : 
                            'Unknown'
                          }
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientAppointments;
