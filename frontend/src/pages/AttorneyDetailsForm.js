import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/doctorDetailsForm.css";
import "../styles/variables.css";
import { API } from "../config/api";

const AttorneyDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get attorneyId from location state or localStorage fallback
  const attorneyId = location.state?.attorneyId || localStorage.getItem('attorneyId') || "";  
  const attorneyName = location.state?.attorneyName || localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').name : "";  

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

  const [formData, setFormData] = useState({
    attorneyId,
    attorneyName: attorneyName, // Attorney name from registration
    specialization: "",
    qualification: "",
    experience: "",
    fees: "",
    profile_pic: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if attorneyId exists
    if (!formData.attorneyId) {
      alert("❌ Attorney ID not found. Please login again.");
      navigate("/attorney-login");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch(API.ATTORNEY_DETAILS, {
        method: "POST",
        body: data
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Attorney details submitted successfully!");
        console.log(result);
        // Store updated attorney info in localStorage
        if (result.attorney) {
          localStorage.setItem('user', JSON.stringify(result.attorney));
        }
        navigate("/attorney/profile");
      } else {
        alert(result.message || "❌ Failed to submit details");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("⚠️ Proceeding to profile...");
      navigate("/attorney/profile");
    }
  };

  return (
    <div className="doctor-form-container">
      <form className="doctor-form" onSubmit={handleSubmit}>
        <h2> Attorney Profile Details</h2>

        <div className="form-group">
          <label>Specialization</label>
          <select name="specialization" onChange={handleChange} required value={formData.specialization}>
            <option value="">Select Specialization</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Qualification</label>
          <input type="text" name="qualification" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Experience (years)</label>
          <input type="number" name="experience" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Consultation Fees (₹)</label>
          <input type="number" name="fees" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" name="profile_pic" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AttorneyDetailsForm;