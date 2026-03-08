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
    updating: null,
    deleting: null
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Fetching attorney appointments...");
      console.log("🔍 Token:", token.substring(0, 20) + "...");
      
      const res = await fetch(API.ATTORNEY_APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("🔍 Response status:", res.status);
      console.log("🔍 Response headers:", Object.fromEntries(res.headers.entries()));
      
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
          status: apt.status,
          doctor_id: apt.doctor_id,
          attorney_id: apt.attorney_id
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
    
    // Auto-refresh every 30 seconds to get latest appointments and status updates
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);
    
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

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setActionLoading(prev => ({ ...prev, deleting: appointmentId }));
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API.ATTORNEY_APPOINTMENTS}/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('Appointment deleted successfully');
          fetchAppointments(); // Refresh the list
        } else {
          console.error('Error deleting appointment:', data.message);
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      } finally {
        setActionLoading(prev => ({ ...prev, deleting: null }));
      }
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
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
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select 
                              value={appt.status || 'Pending'}
                              onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                              style={{ padding: '5px', borderRadius: '4px', minWidth: '120px' }}
                              disabled={actionLoading.updating === appt.id}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => handleViewAppointment(appt)}
                              style={{
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                              }}
                              title="View full appointment details"
                            >
                              View
                            </button>
                            <button
                              onClick={() => deleteAppointment(appt.id)}
                              style={{
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                              }}
                              disabled={actionLoading.deleting === appt.id}
                              title="Delete this appointment"
                            >
                              {actionLoading.deleting === appt.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                      No appointments to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: '20px', color: '#333' }}>Appointment Details</h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Client Name:</strong>
                <span>{selectedAppointment.patient?.name || selectedAppointment.client || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Email:</strong>
                <span>{selectedAppointment.patient?.email || selectedAppointment.clientEmail || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Phone:</strong>
                <span>{selectedAppointment.patient?.phone || selectedAppointment.clientPhone || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Subject:</strong>
                <span>{selectedAppointment.subject || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Purpose:</strong>
                <span>{selectedAppointment.purpose || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Case Summary:</strong>
                <span>{selectedAppointment.caseSummary || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Documents:</strong>
                <span>{selectedAppointment.documents || 'No documents provided'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Desired Outcome:</strong>
                <span>{selectedAppointment.desiredOutcome || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Date & Time:</strong>
                <span>
                  <strong>{selectedAppointment.date}</strong> at <strong>{selectedAppointment.time}</strong>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Status:</strong>
                <span className={`status ${selectedAppointment.status?.toLowerCase() || 'pending'}`}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: 
                      selectedAppointment.status === 'Confirmed' ? '#28a745' :
                      selectedAppointment.status === 'Completed' ? '#17a2b8' :
                      selectedAppointment.status === 'Cancelled' || selectedAppointment.status === 'Rejected' ? '#dc3545' :
                      selectedAppointment.status === 'Pending' ? '#ffc107' : '#6c757d',
                    color: selectedAppointment.status === 'Pending' ? '#000' : '#fff'
                  }}>
                  {selectedAppointment.status || 'Pending'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Attorney Fees:</strong>
                <span>₹{selectedAppointment.attorneyFees || selectedAppointment.fees || 'N/A'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'start' }}>
                <strong style={{ color: '#555' }}>Booked On:</strong>
                <span>
                  {selectedAppointment.createdAt ? 
                    new Date(selectedAppointment.createdAt).toLocaleString() : 
                    'N/A'
                  }
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttorneyAppointments;
