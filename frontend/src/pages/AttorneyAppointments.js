// src/pages/AttorneyAppointments.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/AttorneySidebar";
import "../styles/doctorAppointments.css";
import { API } from "../config/api";

const AttorneyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({
    updating: null
  });

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Fetching attorney appointments...");
      const res = await fetch(API.ATTORNEY_APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("🔍 Attorney appointments response:", data);
      console.log("🔍 Number of appointments received:", data.appointments?.length || 0);
      
      if (data.appointments && data.appointments.length > 0) {
        console.log("🔍 Latest appointment:", data.appointments[0]);
        console.log("🔍 All appointment details:", data.appointments.map(apt => ({
          id: apt.id,
          clientName: apt.patient?.name || apt.client,
          subject: apt.subject,
          purpose: apt.purpose,
          date: apt.date,
          time: apt.time,
          status: apt.status
        })));
      }
      
      if (!res.ok) throw new Error(data.message || "Failed to load appointments");

      console.log("🔍 Setting attorney appointments:", data.appointments);
      console.log("🔍 Appointments data type:", typeof data.appointments);
      console.log("🔍 Appointments is array:", Array.isArray(data.appointments));
      console.log("🔍 First appointment details:", data.appointments?.[0]);
      
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error("❌ Error fetching appointments:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log appointments state changes
  useEffect(() => {
    console.log("🔍 Appointments state updated:", appointments);
    console.log("🔍 Appointments length:", appointments.length);
  }, [appointments]);

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh every 30 seconds to get latest appointments
    const interval = setInterval(fetchAppointments, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setActionLoading(prev => ({ ...prev, updating: appointmentId }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API.ATTORNEY_UPDATE_APPOINTMENT_STATUS}/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        // Refresh the appointments list
        fetchAppointments();
      } else {
        console.error('Error updating appointment status:', data.message);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, updating: null }));
    }
  };

  return (
    <div className="appointments-page">
      <Sidebar />
      <div className="appointments-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Appointments</h1>
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
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            <p>{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No appointments found.</p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              Found {appointments.length} appointments
            </p>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject Line</th>
                  <th>Purpose of Meeting</th>
                  <th>Brief Case Summary</th>
                  <th>Relevant Documents</th>
                  <th>Desired Outcome</th>
                  <th>Preferred Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.length > 0 ? (
                  appointments.map((appt, index) => {
                    console.log(`🔍 Rendering appointment ${index + 1}:`, {
                      id: appt.id,
                      clientName: appt.patient?.name || appt.client,
                      email: appt.patient?.email || appt.clientEmail,
                      subject: appt.subject,
                      purpose: appt.purpose
                    });
                    
                    return (
                      <tr key={appt.id} style={{ border: '1px solid #ddd' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <strong>{appt.patient?.name || appt.client || 'Unknown Client'}</strong>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.patient?.email || appt.clientEmail || 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.patient?.phone || appt.clientPhone || 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.subject || 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.purpose || 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.caseSummary ? `${appt.caseSummary.substring(0, 80)}...` : 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.documents || 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <small>{appt.desiredOutcome ? `${appt.desiredOutcome.substring(0, 60)}...` : 'N/A'}</small>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <div>
                            <strong>{appt.date}</strong>
                            <br />
                            <small>{appt.time}</small>
                          </div>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <span className={`status ${appt.status?.toLowerCase() || 'pending'}`}>
                            {appt.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <select 
                            value={appt.status || 'Pending'}
                            onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                            style={{ padding: '5px', borderRadius: '4px' }}
                            disabled={actionLoading.updating === appt.id}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                      No appointments to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AttorneyAppointments;
