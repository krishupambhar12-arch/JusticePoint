import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../config/api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminDashboard.css';
import '../styles/adminDoctors.css';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAllDetailsModal, setShowAllDetailsModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    creating: false,
    updating: false,
    deleting: null
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    qualification: '',
    specialization: '',
    joiningDate: '',
    attorneyCode: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const specializations = [
    'Civil Law',
    'Corporate Law', 
    'Family Law',
    'Criminal Law',
    'Real Estate Law',
    'Tax Law',
    'Immigration Law',
    'Intellectual Property Law',
    'Labor Law',
    'Environmental Law',
    'Administrative Law',
    'Cyber Security Law'
  ];

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  console.log("🔍 Frontend Debug - Token exists:", !!token);
  console.log("🔍 Frontend Debug - Role:", role);
  console.log("🔍 Frontend Debug - Token:", token ? token.substring(0, 20) + "..." : "null");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (showAddModal && !editingDoctor) {
      generateAttorneyCode();
    }
  }, [showAddModal, editingDoctor]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      // Check if user is authenticated as admin
      if (!token) {
        setMessage('Please login first');
        setLoading(false);
        return;
      }
      
      if (role !== 'Admin') {
        setMessage('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      
      // Fetch from both codes and attorney collections to get all attorneys
      const [codesResponse, attorneysResponse] = await Promise.all([
        fetch(API.ADMIN_CODES, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(API.ADMIN_DOCTORS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const codesData = await codesResponse.json();
      const attorneysData = await attorneysResponse.json();
      
      if (codesResponse.ok && attorneysResponse.ok) {
        // Combine data from both collections
        const allAttorneys = [];
        
        // Add attorneys from codes collection
        if (codesData.codes && Array.isArray(codesData.codes)) {
          codesData.codes.forEach(attorney => {
            allAttorneys.push({
              ...attorney,
              source: 'codes'
            });
          });
        }
        
        // Add attorneys from doctors collection
        if (attorneysData.doctors && Array.isArray(attorneysData.doctors)) {
          attorneysData.doctors.forEach(attorney => {
            // Check if this attorney is already in the list
            const existingIndex = allAttorneys.findIndex(a => a.email === attorney.email);
            if (existingIndex === -1) {
              allAttorneys.push({
                ...attorney,
                source: 'doctors'
              });
            }
          });
        }
        
        setDoctors(allAttorneys);
        console.log("🔍 All attorneys loaded:", allAttorneys);
        console.log("🔍 Attorneys from codes:", codesData.codes);
        console.log("🔍 Attorneys from doctors:", attorneysData.doctors);
      } else {
        const errorMessage = codesData.message || attorneysData.message || 'Error fetching attorneys';
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage('Error connecting to server');
      console.error("Fetch error:", error);
    }
    setLoading(false);
  }, [token, role]);

  // Filter doctors based on search and specialty - recalculate when dependencies change
  const filteredDoctors = React.useMemo(() => {
    return doctors.filter(doctor => {
      const doctorName = (doctor.name || '').toLowerCase();
      const doctorEmail = (doctor.email || '').toLowerCase();
      const doctorSpecialization = (doctor.specialization || '').toLowerCase();
      const searchTerm = (doctorSearch || '').toLowerCase();
      
      const matchesSearch = !doctorSearch || 
        doctorName.includes(searchTerm) ||
        doctorEmail.includes(searchTerm) ||
        doctorSpecialization.includes(searchTerm);
      
      const matchesSpecialty = selectedSpecialty === 'all' || 
        (doctor.specialization && doctor.specialization === selectedSpecialty);
      
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, doctorSearch, selectedSpecialty]);

  console.log("🔍 AdminDoctors Debug:");
  console.log("  - Total doctors:", doctors.length);
  console.log("  - Doctor search:", doctorSearch);
  console.log("  - Selected specialty:", selectedSpecialty);
  console.log("  - Filtered doctors:", filteredDoctors.length);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    
    if (!formData.qualification.trim()) {
      errors.qualification = 'Qualification is required';
    }
    
    if (!formData.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    }
    
    if (!formData.joiningDate.trim()) {
      errors.joiningDate = 'Joining date is required';
    }
    
    if (!formData.attorneyCode.trim()) {
      errors.attorneyCode = 'Attorney code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateAttorneyCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      attorneyCode: code,
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0]
    });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    console.log("🔍 handleAddDoctor called!");
    console.log("🔍 Form submitted with data:", formData);
    
    console.log("🔍 Add Attorney Debug - Token:", token ? token.substring(0, 20) + "..." : "null");
    console.log("🔍 Add Attorney Debug - Role:", role);
    
    // Check if user is authenticated as admin
    if (!token) {
      setMessage('Please login first');
      return;
    }
    
    if (role !== 'Admin') {
      setMessage('Access denied. Admin privileges required.');
      return;
    }
    
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }

    setActionLoading(prev => ({ ...prev, creating: true }));
    try {
      // Test with auth route
      console.log("🔍 Frontend - Making API call to codes endpoint");
      console.log("🔍 Frontend - Request URL:", "https://justicepoint-backend.onrender.com/admin/codes");
      console.log("🔍 Frontend - Request data:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        qualification: formData.qualification,
        joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
        attorneyCode: formData.attorneyCode
      });
      
      const response = await fetch("https://justicepoint-backend.onrender.com/admin/codes", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          qualification: formData.qualification,
          specialization: formData.specialization,
          joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
          attorneyCode: formData.attorneyCode
        })
      });

      console.log("🔍 Frontend - Response status:", response.status);
      console.log("🔍 Frontend - Response ok:", response.ok);

      const data = await response.json();
      console.log("🔍 Frontend - Response data:", data);
      
      if (response.ok) {
        console.log("✅ Attorney creation successful!");
        console.log("✅ Created attorney data:", data.code);
        setMessage('Attorney created successfully');
        setShowAddModal(false);
        resetForm();
        
        // Refresh the attorneys list
        console.log("🔍 Refreshing attorneys list...");
        fetchDoctors();
      } else {
        console.log("❌ Attorney creation failed:", data);
        setMessage(data.message || 'Error creating attorney');
      }
    } catch (error) {
      console.error("❌ Frontend - Create attorney error:", error);
      console.error("❌ Frontend - Error details:", error.message);
      console.error("❌ Frontend - Error stack:", error.stack);
      setMessage('Error connecting to server: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      gender: doctor.gender || 'Male',
      qualification: doctor.qualification || '',
      specialization: doctor.specialization || '',
      joiningDate: doctor.joiningDate || '',
      attorneyCode: doctor.attorneyCode || ''
    });
    setShowAddModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setViewingDoctor(doctor);
    setShowViewModal(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }

    setActionLoading(prev => ({ ...prev, updating: true }));
    try {
      const response = await fetch(`${API.ADMIN_CODES}/${editingDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          qualification: formData.qualification,
          specialization: formData.specialization,
          joiningDate: formData.joiningDate,
          attorneyCode: formData.attorneyCode
        })
      });

      if (response.ok) {
        setMessage('Attorney updated successfully');
        setShowAddModal(false);
        setEditingDoctor(null);
        resetForm();
        fetchDoctors();
      } else {
        setMessage('Error updating attorney');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setActionLoading(prev => ({ ...prev, updating: false }));
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    // Check if user is authenticated as admin
    if (!token) {
      setMessage('Please login first');
      return;
    }
    
    if (role !== 'Admin') {
      setMessage('Access denied. Admin privileges required.');
      return;
    }
    
    const doctorName = doctors.find(d => d.id === doctorId)?.name || 'this attorney';
    
    if (window.confirm(`Are you sure you want to delete ${doctorName}? This action cannot be undone.`)) {
      setActionLoading(prev => ({ ...prev, deleting: doctorId }));
      try {
        console.log("🔍 Frontend Delete Debug - Deleting attorney ID:", doctorId);
        console.log("🔍 Frontend Delete Debug - Token:", token ? token.substring(0, 20) + "..." : "null");
        console.log("🔍 Frontend Delete Debug - API URL:", `${API.ADMIN_CODES}/${doctorId}`);
        
        const response = await fetch(`${API.ADMIN_CODES}/${doctorId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("🔍 Frontend Delete Debug - Response status:", response.status);
        console.log("🔍 Frontend Delete Debug - Response ok:", response.ok);

        const data = await response.json();
        console.log("🔍 Frontend Delete Debug - Response data:", data);
        
        if (response.ok) {
          setMessage(`Attorney "${doctorName}" deleted successfully. Login access has been revoked.`);
          fetchDoctors();
        } else {
          setMessage(data.message || 'Error deleting attorney');
        }
      } catch (error) {
        console.error("❌ Delete error:", error);
        setMessage('Error connecting to server');
      } finally {
        setActionLoading(prev => ({ ...prev, deleting: null }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      qualification: '',
      specialization: '',
      joiningDate: '',
      attorneyCode: ''
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingDoctor(null);
    resetForm();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingDoctor(null);
  };

  const handleShowAllDetails = () => {
    setShowAllDetailsModal(true);
  };

  const handleReAuth = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleCloseAllDetailsModal = () => {
    setShowAllDetailsModal(false);
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar />
      <div className="dashboard-content">
        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage('')}>×</button>
            {(message.includes('Access denied') || message.includes('Please login')) && (
              <button 
                onClick={handleReAuth}
                style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Re-login
              </button>
            )}
          </div>
        )}

        {loading && <div className="loading">Please wait, loading attorneys...</div>}

        <div className="admin-doctors">
          <div className="doctors-header">
            <h2>All Attorneys</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              + Add Attorney
            </button>
          </div>
          
          {/* Attorney Search and Filter Section */}
          <div className="attorney-search-section">
            <h3>Search & Filter Attorneys</h3>
            <div className="search-filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search attorneys by name, specialization, or email..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">Search</button>
              </div>
              
              <div className="filter-box">
                <label htmlFor="specialty-filter">Filter by Speciality:</label>
                <select
                  id="specialty-filter"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="specialty-select"
                >
                  <option value="all">All Specialities</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="Real Estate Law">Real Estate Law</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Immigration Law">Immigration Law</option>
                  <option value="Intellectual Property Law">Intellectual Property Law</option>
                  <option value="Labor Law">Labor Law</option>
                  <option value="Environmental Law">Environmental Law</option>
                  <option value="Administrative Law">Administrative Law</option>
                  <option value="Cyber Security Law">Cyber Security Law</option>
                </select>
              </div>
            </div>
          </div>

          {doctors && doctors.length > 0 ? (
            <div className="doctors-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Qualification</th>
                    <th>Specialization</th>
                    <th>Joining Date</th>
                    <th>Attorney Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.gender}</td>
                      <td>{doctor.qualification}</td>
                      <td>{doctor.specialization || "N/A"}</td>
                      <td>{doctor.joiningDate ? new Date(doctor.joiningDate).toLocaleDateString() : "N/A"}</td>
                      <td>{doctor.attorneyCode || "N/A"}</td>
                      <td>
                        <button
                          onClick={() => handleViewDoctor(doctor)}
                          className="btn btn-view"
                          disabled={actionLoading.deleting === doctor.id}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditDoctor(doctor)}
                          className="btn btn-edit"
                          disabled={actionLoading.deleting === doctor.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="btn btn-delete"
                          disabled={actionLoading.deleting === doctor.id}
                        >
                          {actionLoading.deleting === doctor.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <div className="no-data">
                <p>No attorneys found. Click "Add Attorney" to create one.</p>
              </div>
            )
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingDoctor ? 'Edit Attorney' : 'Add New Attorney'}</h3>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>
              <form onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && (
                      <span className="error-message">{formErrors.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && (
                      <span className="error-message">{formErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={formErrors.phone ? 'error' : ''}
                    />
                    {formErrors.phone && (
                      <span className="error-message">{formErrors.phone}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qualification">Qualification *</label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={formErrors.qualification ? 'error' : ''}
                    />
                    {formErrors.qualification && (
                      <span className="error-message">{formErrors.qualification}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialization">Specialization *</label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={formErrors.specialization ? 'error' : ''}
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    {formErrors.specialization && (
                      <span className="error-message">{formErrors.specialization}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="joiningDate">Joining Date *</label>
                    <input
                      type="date"
                      id="joiningDate"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className={formErrors.joiningDate ? 'error' : ''}
                    />
                    {formErrors.joiningDate && (
                      <span className="error-message">{formErrors.joiningDate}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="attorneyCode">Attorney Code *</label>
                    <div className="attorney-code-input">
                      <input
                        type="text"
                        id="attorneyCode"
                        name="attorneyCode"
                        value={formData.attorneyCode}
                        onChange={handleInputChange}
                        className={formErrors.attorneyCode ? 'error' : ''}
                        readOnly={editingDoctor}
                      />
                      {!editingDoctor && (
                        <button
                          type="button"
                          onClick={generateAttorneyCode}
                          className="btn btn-regenerate"
                        >
                          Regenerate
                        </button>
                      )}
                    </div>
                    {formErrors.attorneyCode && (
                      <span className="error-message">{formErrors.attorneyCode}</span>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading.creating || actionLoading.updating}
                  >
                    {actionLoading.creating || actionLoading.updating
                      ? 'Saving...'
                      : editingDoctor
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewingDoctor && (
          <div className="modal-overlay" onClick={handleCloseViewModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Attorney Details</h3>
                <button className="modal-close" onClick={handleCloseViewModal}>×</button>
              </div>
              <div className="view-details">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{viewingDoctor.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{viewingDoctor.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{viewingDoctor.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Gender:</span>
                  <span className="detail-value">{viewingDoctor.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Qualification:</span>
                  <span className="detail-value">{viewingDoctor.qualification}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Specialization:</span>
                  <span className="detail-value">{viewingDoctor.specialization || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joining Date:</span>
                  <span className="detail-value">{viewingDoctor.joiningDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Attorney Code:</span>
                  <span className="detail-value">{viewingDoctor.attorneyCode}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseViewModal}
                  className="btn btn-cancel"
                >
                  Close
                </button>
              
              </div>
            </div>
          </div>
        )}

        {/* All Details Modal */}
        {showAllDetailsModal && (
          <div className="modal-overlay" onClick={handleCloseAllDetailsModal}>
            <div className="modal-content all-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>All Attorney Details</h3>
                <button className="modal-close" onClick={handleCloseAllDetailsModal}>×</button>
              </div>
              <div className="all-details-content">
                {doctors && doctors.length > 0 ? (
                  <div className="all-details-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Gender</th>
                          <th>Qualification</th>
                          <th>Specialization</th>
                          <th>Joining Date</th>
                          <th>Attorney Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map(doctor => (
                          <tr key={doctor.id}>
                            <td>{doctor.name}</td>
                            <td>{doctor.email}</td>
                            <td>{doctor.phone}</td>
                            <td>{doctor.gender}</td>
                            <td>{doctor.qualification}</td>
                            <td>{doctor.specialization || 'N/A'}</td>
                            <td>{doctor.joiningDate}</td>
                            <td>{doctor.attorneyCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No attorneys found. Please add some attorneys first.</p>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseAllDetailsModal}
                  className="btn btn-cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;
