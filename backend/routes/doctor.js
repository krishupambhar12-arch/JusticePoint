// back-end/routes/doctor.js (attorney routes; mounted at /attorney)
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Attorney = require("../models/Attorney");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Consultation = require("../models/Consultation");
const ConsultationMessage = require("../models/ConsultationMessage");
const Appointment = require("../models/Appointment");

// ===== Multer setup for file upload =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads/ folder root me hona chahiye
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ===== DEBUG ROUTE - Check Attorney Data =====
router.get("/debug", async (req, res) => {
  try {
    console.log("🔍 Debug: Checking attorney data...");
    
    const allAttorneys = await Attorney.find({});
    console.log("🔍 Total attorneys found:", allAttorneys.length);
    
    const attorneyData = allAttorneys.map(att => ({
      id: att._id,
      email: att.attorneyEmail,
      name: att.attorneyName,
      hasPassword: !!att.attorneyPassword,
      passwordLength: att.attorneyPassword ? att.attorneyPassword.length : 0
    }));
    
    res.json({
      message: "Debug data",
      totalAttorneys: allAttorneys.length,
      attorneys: attorneyData
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({ message: "Debug error", error: error.message });
  }
});

// ===== ATTORNEY LOGIN =====
router.post("/login", async (req, res) => {
  try {
    console.log("🔍 Attorney login attempt:", { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Debug: Check all attorneys in database
    console.log("🔍 Checking all attorneys in database...");
    const allAttorneys = await Attorney.find({});
    console.log("🔍 Total attorneys found:", allAttorneys.length);
    allAttorneys.forEach(att => {
      console.log(`  - ${att.attorneyEmail} (ID: ${att._id})`);
    });

    // Also check User model for attorneys
    console.log("🔍 Checking User model for attorneys...");
    const userAttorneys = await User.find({ role: "Attorney" });
    console.log("🔍 Total attorneys in User model:", userAttorneys.length);
    userAttorneys.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user._id})`);
    });

    // Find attorney by email in Attorney model first
    let attorney = await Attorney.findOne({ attorneyEmail: email });
    console.log("🔍 Attorney found in Attorney model:", attorney ? "Yes" : "No");
    
    // If not found in Attorney model, check User model
    if (!attorney) {
      console.log("🔍 Checking User model for attorney...");
      const userAttorney = await User.findOne({ email, role: "Attorney" });
      if (userAttorney) {
        console.log("🔍 Attorney found in User model, creating Attorney record...");
        
        // Check if User has comparePassword method, if not, use direct bcrypt comparison
        let isPasswordMatch = false;
        try {
          if (userAttorney.comparePassword) {
            isPasswordMatch = await userAttorney.comparePassword(password);
          } else {
            // Use direct bcrypt comparison
            const bcrypt = require('bcryptjs');
            isPasswordMatch = await bcrypt.compare(password, userAttorney.password);
          }
        } catch (error) {
          console.log("❌ Password comparison error:", error.message);
        }
        
        if (!isPasswordMatch) {
          console.log("❌ Invalid password for User model attorney");
          return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Create Attorney record from User data
        attorney = new Attorney({
          attorneyName: userAttorney.name,
          attorneyEmail: userAttorney.email,
          attorneyPassword: userAttorney.password, // Already hashed
          attorneyPhone: userAttorney.phone || "",
          attorneyGender: userAttorney.gender || "",
          attorneyAddress: userAttorney.address || "",
          attorneyDOB: userAttorney.dateOfBirth || null,
          specialization: "",
          qualification: "",
          experience: 0,
          fees: 0,
          profilePicture: null
        });
        
        await attorney.save();
        console.log("✅ Attorney record created from User data");
        
        // Remove from User model to avoid duplicates
        await User.deleteOne({ _id: userAttorney._id });
        console.log("🔍 Removed duplicate from User model");
      }
    }
    
    if (!attorney) {
      console.log("❌ Attorney not found for email:", email);
      return res.status(404).json({ message: "Attorney not found" });
    }

    console.log("🔍 Attorney ID:", attorney._id);
    console.log("🔍 Attorney email:", attorney.attorneyEmail);
    console.log("🔍 Attorney has password:", !!attorney.attorneyPassword);

    // Check password - Attorney model has comparePassword method
    if (!attorney.attorneyPassword) {
      console.log("❌ Attorney has no password set");
      return res.status(500).json({ message: "Attorney account not properly configured" });
    }

    console.log("🔍 Attempting password comparison...");
    const isMatch = await attorney.comparePassword(password);
    console.log("🔍 Password match:", isMatch ? "Yes" : "No");
    
    if (!isMatch) {
      console.log("❌ Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: attorney._id, role: "Attorney" },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "24h" }
    );

    console.log("✅ Attorney login successful for:", email);

    console.log("🔍 Generated token payload:", {
      id: attorney._id,
      role: "Attorney"
    });

    res.status(200).json({
      message: "Login successful",
      token,
      attorney: {
        id: attorney._id,
        name: attorney.attorneyName,
        email: attorney.attorneyEmail
      }
    });
  } catch (error) {
    console.error("❌ Attorney login error:", error);
    console.error("❌ Error type:", error.constructor.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Send specific error messages based on error type
    let errorMessage = "Server error";
    if (error.message.includes("bcrypt")) {
      errorMessage = "Password verification failed";
    } else if (error.message.includes("Cast to ObjectId failed")) {
      errorMessage = "Invalid attorney ID format";
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
      errorMessage = "Database connection error";
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== POST Attorney Details =====
router.post("/details", upload.single("profile_pic"), async (req, res) => {
  try {
    const { 
      attorneyId,
      attorneyName,
      specialization, 
      qualification, 
      experience, 
      fees
    } = req.body;

    console.log("🔍 Attorney details submission:");
    console.log("  - attorneyId:", attorneyId);
    console.log("  - attorneyName:", attorneyName);
    console.log("  - specialization:", specialization);
    console.log("  - qualification:", qualification);
    console.log("  - experience:", experience);
    console.log("  - fees:", fees);
    console.log("  - profile_pic:", req.file?.filename);

    if (!attorneyId) {
      return res.status(400).json({ message: "❌ attorneyId is required" });
    }

    if (!specialization || !qualification || !experience || !fees) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    // Update existing attorney record
    const attorney = await Attorney.findByIdAndUpdate(
      attorneyId,
      {
        attorneyName,
        specialization,
        qualification,
        experience: parseInt(experience) || 0,
        fees: parseFloat(fees) || 0,
        profilePicture: req.file ? req.file.filename : null
      },
      { new: true }
    );

    if (!attorney) {
      return res.status(404).json({ message: "❌ Attorney not found" });
    }

    console.log("✅ Attorney details updated in 'attorneys' table:");
    console.log("  - Updated ID:", attorney._id);
    console.log("  - Updated Name:", attorney.attorneyName);
    console.log("  - Updated Specialization:", attorney.specialization);
    console.log("  - Updated Qualification:", attorney.qualification);
    console.log("  - Updated Experience:", attorney.experience);
    console.log("  - Updated Fees:", attorney.fees);

    res.status(200).json({
      message: "✅ Attorney details updated successfully!",
      attorney: {
        id: attorney._id,
        attorneyName: attorney.attorneyName,
        attorneyEmail: attorney.attorneyEmail,
        specialization: attorney.specialization,
        qualification: attorney.qualification,
        experience: attorney.experience,
        fees: attorney.fees,
        profilePicture: attorney.profilePicture
      }
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ===== UPDATE Attorney Profile =====
// PUT /attorney/profile  (auth required)
// Accepts multipart/form-data for optional profile_pic
router.put("/profile", auth, upload.single("profile_pic"), async (req, res) => {
  try {
    const {
      attorneyName,
      attorneyEmail,
      attorneyPhone,
      attorneyGender,
      attorneyAddress,
      attorneyDOB,
      specialization,
      qualification,
      experience,
      fees
    } = req.body;

    // Find attorney by ID (from auth middleware)
    const attorney = await Attorney.findById(req.userId);
    if (!attorney) {
      return res.status(404).json({ message: "Attorney not found" });
    }

    // Update fields - only update if value is provided and not empty
    if (attorneyName && attorneyName.trim()) attorney.attorneyName = attorneyName.trim();
    if (attorneyEmail && attorneyEmail.trim()) attorney.attorneyEmail = attorneyEmail.trim();
    if (attorneyPhone && attorneyPhone.trim()) attorney.attorneyPhone = attorneyPhone.trim();
    if (attorneyGender && attorneyGender.trim()) attorney.attorneyGender = attorneyGender.trim();
    if (attorneyAddress && attorneyAddress.trim()) attorney.attorneyAddress = attorneyAddress.trim();
    if (attorneyDOB && attorneyDOB.trim()) attorney.attorneyDOB = attorneyDOB.trim();
    if (specialization && specialization.trim()) attorney.specialization = specialization.trim();
    if (qualification && qualification.trim()) attorney.qualification = qualification.trim();
    if (experience !== undefined && experience !== "") attorney.experience = parseInt(experience) || 0;
    if (fees !== undefined && fees !== "") attorney.fees = parseFloat(fees) || 0;
    if (req.file) {
    console.log("🔍 Profile picture uploaded:", req.file.filename);
    console.log("🔍 Full file path:", req.file.path);
    attorney.profilePicture = req.file.filename;
  }

    await attorney.save();

    res.json({
      message: "Profile updated successfully",
      attorney: {
        id: attorney._id,
        attorneyName: attorney.attorneyName,
        attorneyEmail: attorney.attorneyEmail,
        attorneyPhone: attorney.attorneyPhone,
        attorneyGender: attorney.attorneyGender,
        attorneyAddress: attorney.attorneyAddress,
        attorneyDOB: attorney.attorneyDOB,
        specialization: attorney.specialization,
        qualification: attorney.qualification,
        experience: attorney.experience,
        fees: attorney.fees,
        profilePicture: attorney.profilePicture ? `uploads/${attorney.profilePicture}` : null
      }
    });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /attorney/dashboard  -> Attorney + today's appointments count
router.get("/dashboard", auth, async (req, res) => {
  try {
    console.log("🔍 Dashboard request - userId:", req.userId);
    console.log("🔍 Dashboard request - userRole:", req.userRole);
    
    // Attorney profile (direct lookup by attorney ID)
    const attorney = await Attorney.findById(req.userId).lean();
    console.log("🔍 Attorney found:", attorney ? "Yes" : "No");
    console.log("🔍 Attorney data:", attorney);
    
    if (!attorney) {
      console.log("❌ Attorney not found for ID:", req.userId);
      return res.status(404).json({ message: "Attorney profile not found" });
    }

    // Stats (0 if Appointment model not present)
    let todayCount = 0;
    let totalClients = 0;
    let upcomingAppointments = 0;
    let earnings = 0;

    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date();   end.setHours(23,59,59,999);

    // today count
    todayCount = await Appointment.countDocuments({
      doctor_id: attorney._id,
      date: { $gte: start, $lte: end },
      status: { $ne: "Cancelled" }
    });

    // total unique clients seen by this attorney
    const uniqueClients = await Appointment.distinct("user_id", { doctor_id: attorney._id });
    totalClients = uniqueClients.length;

    // upcoming appointments from now (status pending/confirmed)
    upcomingAppointments = await Appointment.countDocuments({
      doctor_id: attorney._id,
      date: { $gte: new Date() },
      status: { $in: ["Pending", "Confirmed"] }
    });

    // simple earnings estimate = total completed appointments * fees
    const completedCount = await Appointment.countDocuments({
      doctor_id: attorney._id,
      status: { $in: ["Completed", "Done", "Approved"] }
    });
    earnings = completedCount * (attorney.fees || 0);

    res.json({
      attorney: {
        id: attorney._id,
        name: attorney.attorneyName,
        email: attorney.attorneyEmail,
        phone: attorney.attorneyPhone,
        gender: attorney.attorneyGender,
        address: attorney.attorneyAddress,
        dateOfBirth: attorney.attorneyDOB,
        specialization: attorney.specialization,
        qualification: attorney.qualification,
        experience: attorney.experience,
        fees: attorney.fees,
        profile_pic: attorney.profilePicture ? `uploads/${attorney.profilePicture}` : null
      },
      stats: {
        todayAppointments: todayCount,
        totalClients,
        upcomingAppointments,
        earnings
      }
    });
    console.log("🔍 Dashboard response - profile picture:", attorney.profilePicture);
  } catch (e) {
    console.error("Dashboard error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DEBUG: Check All Appointments =====
router.get("/debug-all-appointments", async (req, res) => {
  try {
    console.log("🔍 Debug: Checking all appointments in database...");
    
    const Appointment = require("../models/Appointment");
    const appointments = await Appointment.find({}).lean();
    
    console.log("🔍 Total appointments in database:", appointments.length);
    
    if (appointments.length > 0) {
      console.log("🔍 Sample appointment from database:");
      console.log("  - ID:", appointments[0]._id);
      console.log("  - User ID:", appointments[0].user_id);
      console.log("  - Doctor ID:", appointments[0].doctor_id);
      console.log("  - Attorney ID:", appointments[0].attorney_id);
      console.log("  - Subject:", appointments[0].subject);
      console.log("  - Purpose:", appointments[0].purpose);
      console.log("  - Case Summary:", appointments[0].caseSummary);
      console.log("  - Documents:", appointments[0].documents);
      console.log("  - Desired Outcome:", appointments[0].desiredOutcome);
      console.log("  - Date:", appointments[0].date);
      console.log("  - Time:", appointments[0].time);
      console.log("  - Personal Info:", appointments[0].personalInfo);
      console.log("  - Attorney Name:", appointments[0].attorneyName);
      console.log("  - Status:", appointments[0].status);
    }
    
    res.json({
      total: appointments.length,
      appointments: appointments.map(apt => ({
        id: apt._id,
        user_id: apt.user_id,
        doctor_id: apt.doctor_id,
        attorney_id: apt.attorney_id,
        subject: apt.subject,
        purpose: apt.purpose,
        caseSummary: apt.caseSummary,
        documents: apt.documents,
        desiredOutcome: apt.desiredOutcome,
        date: apt.date,
        time: apt.time,
        personalInfo: apt.personalInfo,
        attorneyName: apt.attorneyName,
        attorneySpecialization: apt.attorneySpecialization,
        attorneyFees: apt.attorneyFees,
        status: apt.status,
        createdAt: apt.createdAt
      }))
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({ message: "Debug error" });
  }
});

// ===== DEBUG: Check Attorney IDs =====
router.get("/debug-attorneys", async (req, res) => {
  try {
    console.log("🔍 Debug: Checking attorney IDs...");
    
    // Check Attorney model
    const Attorney = require("../models/Attorney");
    const Code = require("../models/Code");
    
    const attorneys = await Attorney.find({}).lean();
    const codes = await Code.find({}).lean();
    
    console.log("🔍 Attorney model records:", attorneys.length);
    console.log("🔍 Attorney IDs:", attorneys.map(a => ({ id: a._id, name: a.name, email: a.email })));
    
    console.log("🔍 Code model records:", codes.length);
    console.log("🔍 Code IDs (attorneys):", codes.filter(c => c.attorneyCode).map(c => ({ id: c._id, name: c.name, email: c.email, attorneyCode: c.attorneyCode })));
    
    // Find Neel specifically
    const neelInAttorney = attorneys.find(a => a.name && a.name.toLowerCase().includes('neel'));
    const neelInCode = codes.find(c => c.name && c.name.toLowerCase().includes('neel'));
    
    console.log("🔍 Neel in Attorney model:", neelInAttorney ? { id: neelInAttorney._id, name: neelInAttorney.name } : 'Not found');
    console.log("🔍 Neel in Code model:", neelInCode ? { id: neelInCode._id, name: neelInCode.name, attorneyCode: neelInCode.attorneyCode } : 'Not found');
    
    res.json({
      attorneys: attorneys.map(a => ({ id: a._id, name: a.name, email: a.email })),
      codes: codes.filter(c => c.attorneyCode).map(c => ({ id: c._id, name: c.name, email: c.email, attorneyCode: c.attorneyCode })),
      neelInAttorney: neelInAttorney ? { id: neelInAttorney._id, name: neelInAttorney.name } : null,
      neelInCode: neelInCode ? { id: neelInCode._id, name: neelInCode.name, attorneyCode: neelInCode.attorneyCode } : null
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({ message: "Debug error" });
  }
});

// ===== GET Attorney Appointments =====
// GET /attorney/appointments  -> All appointments for this attorney
router.get("/appointments", auth, async (req, res) => {
  try {
    console.log("🔍🔍🔍 ATTORNEY APPOINTMENTS REQUEST RECEIVED 🔍🔍🔍");
    console.log("🔍 Get attorney appointments request");
    console.log("🔍 User ID:", req.userId);
    console.log("🔍 User Role:", req.userRole);
    console.log("🔍 Request URL:", req.originalUrl);
    console.log("🔍 Request Method:", req.method);
    
    // Find attorney profile first
    let attorney = await Attorney.findById(req.userId).lean();
    let attorneyId = req.userId;
    let codeAttorneyId = null;
    
    // Always try to find the corresponding Code record based on email
    const Code = require("../models/Code");
    if (attorney && attorney.attorneyEmail) {
      console.log("🔍 Attorney found in Attorney model, looking for corresponding Code record...");
      const codeAttorney = await Code.findOne({ email: attorney.attorneyEmail });
      
      if (codeAttorney) {
        console.log("✅ Corresponding Code record found:", codeAttorney.name);
        codeAttorneyId = codeAttorney._id;
      } else {
        console.log("⚠️ No corresponding Code record found for email:", attorney.attorneyEmail);
      }
    }
    
    // If not found in Attorney model, check Code model directly
    if (!attorney) {
      console.log("🔍 Attorney not found in Attorney model, checking Code model...");
      const codeAttorney = await Code.findById(req.userId);
      
      if (codeAttorney) {
        console.log("✅ Attorney found in Code model:", codeAttorney.name);
        attorney = {
          _id: codeAttorney._id,
          name: codeAttorney.name,
          email: codeAttorney.email,
          specialization: codeAttorney.qualification
        };
        attorneyId = codeAttorney._id;
        codeAttorneyId = codeAttorney._id;
      }
    }

    if (!attorney) {
      console.log("❌ Attorney not found in any model:", req.userId);
      return res.status(404).json({ message: "Attorney profile not found" });
    }

    console.log("✅ Attorney found:", attorney.name || 'Unknown', "Attorney ID:", attorney._id, "Code ID:", codeAttorneyId);

    // Get all appointments for this attorney
    let appointments = [];
    
    // Build the search criteria - use both Attorney ID and Code ID
    let searchCriteria = { isActive: true }; // Only get active appointments
    let attorneyIds = [];
    
    if (attorneyId) {
      attorneyIds.push(attorneyId);
    }
    if (codeAttorneyId) {
      attorneyIds.push(codeAttorneyId);
    }
    
    if (attorneyIds.length > 0) {
      searchCriteria.$or = [
        { doctor_id: { $in: attorneyIds } },
        { attorney_id: { $in: attorneyIds } }
      ];
    }
    
    console.log("🔍 Search criteria:", JSON.stringify(searchCriteria, null, 2));
    
    // Method 1: By attorney IDs (primary method)
    try {
      const appointmentsById = await Appointment.find(searchCriteria)
        .populate('user_id', 'name email phone')
        .sort({ date: 1, time: 1 })
        .lean();

      appointments = appointmentsById;
      console.log("✅ Appointments found by ID:", appointmentsById.length);
    } catch (error) {
      console.error("❌ Error fetching appointments by ID:", error);
    }

    console.log("✅ Total appointments for attorney:", appointments.length);
    
    // Debug: Show appointment details with attorney IDs
    if (appointments.length > 0) {
      console.log("🔍 Appointment details:");
      appointments.forEach((apt, index) => {
        console.log(`  ${index + 1}. ID: ${apt._id}`);
        console.log(`     doctor_id: ${apt.doctor_id}`);
        console.log(`     attorney_id: ${apt.attorney_id}`);
        console.log(`     user_id: ${apt.user_id}`);
        console.log(`     subject: ${apt.subject}`);
        console.log(`     patient name: ${apt.personalInfo?.name || apt.user_id?.name}`);
      });
    }

    // Format appointments for frontend
    const formattedAppointments = appointments.map(appt => {
      // Ensure patient object is properly populated
      const patient = {
        name: appt.personalInfo?.name || appt.user_id?.name || "Unknown Client",
        email: appt.personalInfo?.email || appt.user_id?.email || "",
        phone: appt.personalInfo?.phone || appt.user_id?.phone || ""
      };

      return {
        id: appt._id,
        patient: patient,
        client: patient.name,
        clientEmail: patient.email,
        clientPhone: patient.phone,
        date: new Date(appt.date).toISOString().split('T')[0],
        time: appt.time,
        status: appt.status || "Pending",
        subject: appt.subject || "",
        purpose: appt.purpose || "",
        caseSummary: appt.caseSummary || "",
        documents: appt.documents || "",
        desiredOutcome: appt.desiredOutcome || "",
        attorneyName: appt.attorneyName || "",
        attorneySpecialization: appt.attorneySpecialization || "",
        attorneyFees: appt.attorneyFees || 0,
        personalInfo: appt.personalInfo,
        createdAt: appt.createdAt
      };
    });

    res.json({
      appointments: formattedAppointments,
      total: formattedAppointments.length
    });
  } catch (e) {
    console.error("Appointments error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET All Attorneys (Public) =====
// GET /attorney/all  -> Get all attorneys for public listing
router.get("/all", async (req, res) => {
  try {
    const { specialization, search } = req.query;
    
    // Get active attorneys from Code model (admin managed)
    const Code = require("../models/Code");
    const codeAttorneys = await Code.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    // Check which of these attorneys have actually signed up (exist in Attorney model)
    const Attorney = require("../models/Attorney");
    const signedUpAttorneys = [];
    
    for (const codeAttorney of codeAttorneys) {
      // Check if this attorney exists in Attorney model (has signed up)
      // Try exact match first
      let attorneyRecord = await Attorney.findOne({ 
        attorneyEmail: codeAttorney.email 
      }).lean();
      
      // If no exact match, try fuzzy matching for common typos
      if (!attorneyRecord) {
        // Extract username part before @ and try common domain variations
        const emailParts = codeAttorney.email.split('@');
        if (emailParts.length === 2) {
          const username = emailParts[0];
          const domain = emailParts[1];
          
          // Common domain variations to try
          const domainVariations = [
            domain,
            'gmail.com',
            'yahoo.com',
            'outlook.com',
            'hotmail.com'
          ];
          
          // Try each domain variation
          for (const domainVariation of domainVariations) {
            const variedEmail = `${username}@${domainVariation}`;
            attorneyRecord = await Attorney.findOne({ 
              attorneyEmail: variedEmail 
            }).lean();
            
            if (attorneyRecord) {
              console.log(`🔍 Found attorney with email variation: ${codeAttorney.email} -> ${variedEmail}`);
              break;
            }
          }
          
          // Also try matching by name if email variations don't work
          if (!attorneyRecord && codeAttorney.name) {
            attorneyRecord = await Attorney.findOne({ 
              name: { $regex: codeAttorney.name, $options: 'i' }
            }).lean();
            
            if (attorneyRecord) {
              console.log(`🔍 Found attorney by name matching: ${codeAttorney.name} -> ${attorneyRecord.attorneyEmail}`);
            }
          }
        }
      }
      
      if (attorneyRecord) {
        // Attorney has signed up, include them in public listing
        signedUpAttorneys.push({
          id: codeAttorney._id,
          name: codeAttorney.name || "Attorney Unknown",
          email: codeAttorney.email || "",
          phone: codeAttorney.phone || "",
          specialization: attorneyRecord.specialization || "General Practice",
          qualification: codeAttorney.qualification || "",
          experience: attorneyRecord.experience || 0,
          fees: attorneyRecord.fees || 100,
          profile_pic: attorneyRecord.profilePicture ? `uploads/${attorneyRecord.profilePicture}` : null,
          rating: 4.5,
          available: true
        });
      }
    }
    
    // Apply search filter if provided
    let filteredAttorneys = signedUpAttorneys;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filteredAttorneys = signedUpAttorneys.filter(attorney => 
        attorney.name?.match(searchRegex) ||
        attorney.qualification?.match(searchRegex) ||
        attorney.email?.match(searchRegex) ||
        attorney.specialization?.match(searchRegex)
      );
    }
    
    res.json({
      attorneys: filteredAttorneys,
      total: filteredAttorneys.length
    });
  } catch (e) {
    console.error("Get all attorneys error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== POST Book Appointment =====
router.post("/book-appointment", auth, async (req, res) => {
  console.log("🔍🔍🔍 BOOK APPOINTMENT ENDPOINT HIT!!!");
  console.log("🔍 Request method:", req.method);
  console.log("🔍 Request URL:", req.originalUrl);
  console.log("🔍 Request headers:", req.headers);
  
  try {
    console.log("🔍 Book appointment request received");
    console.log("🔍 User role:", req.userRole);
    console.log("🔍 User ID:", req.userId);
    
    // Check if user is a client
    if (req.userRole !== "Client") {
      console.log("❌ Only clients can book appointments");
      return res.status(403).json({ message: "Only clients can book appointments" });
    }

    const { 
      doctor_id, 
      date, 
      time, 
      subject,
      personalInfo,
      purpose,
      caseSummary,
      documents,
      desiredOutcome,
      attorneyName,
      attorneySpecialization,
      attorneyFees
    } = req.body;

    console.log("🔍 Appointment data:", {
      doctor_id,
      date,
      time,
      subject,
      attorneyName,
      attorneySpecialization,
      attorneyFees
    });

    if (!doctor_id || !date || !time || !subject || !personalInfo || !purpose || !caseSummary || !desiredOutcome) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if attorney exists in Attorney model first
    let attorney = await Attorney.findById(doctor_id);
    
    // If not found in Attorney model, check Code model
    if (!attorney) {
      console.log("🔍 Attorney not found in Attorney model, checking Code model...");
      const Code = require("../models/Code");
      const codeAttorney = await Code.findById(doctor_id);
      
      if (codeAttorney) {
        console.log("✅ Attorney found in Code model:", codeAttorney.name);
        // Create a temporary attorney object for booking
        attorney = {
          _id: codeAttorney._id,
          attorneyName: codeAttorney.name,
          attorneyEmail: codeAttorney.email,
          attorneyPhone: codeAttorney.phone || "",
          specialization: codeAttorney.qualification || "General Practice",
          fees: 100 // Default fees since Code model doesn't have fees field
        };
      }
    }

    if (!attorney) {
      console.log("❌ Attorney not found in any model:", doctor_id);
      return res.status(404).json({ message: "Attorney not found" });
    }

    console.log("✅ Attorney found:", attorney.attorneyName || attorney.name);

    // Check if user is trying to book appointment with themselves (if they are an attorney)
    if (req.userRole === "Attorney") {
      const userAttorney = await Attorney.findById(req.userId);
      if (userAttorney && userAttorney._id.toString() === doctor_id) {
        return res.status(400).json({ message: "Attorneys cannot book appointments with themselves" });
      }
    }

    // Check if appointment already exists for this time slot
    const existingAppointment = await Appointment.findOne({
      doctor_id,
      date,
      time,
      status: { $in: ["Pending", "Upcoming"] }
    });

    if (existingAppointment) {
      console.log("❌ Time slot already booked");
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    // Create new appointment
    const appointment = new Appointment({
      user_id: req.userId,
      attorney_id: doctor_id, // Add attorney_id field
      doctor_id,
      date,
      time,
      subject,
      personalInfo,
      purpose,
      caseSummary,
      documents: documents || "",
      desiredOutcome,
      attorneyName,
      attorneySpecialization,
      attorneyFees,
      status: "Pending"
    });

    console.log("🔍 Saving appointment with all fields...");
    console.log("🔍 Appointment data preview:", {
      user_id: req.userId,
      attorney_id: doctor_id,
      doctor_id,
      date,
      time,
      subject,
      personalInfo,
      purpose,
      caseSummary,
      documents: documents || "",
      desiredOutcome,
      attorneyName,
      attorneySpecialization,
      attorneyFees,
      status: "Pending"
    });
    
    await appointment.save();
    console.log("✅ Appointment saved successfully with all fields:", appointment._id);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        id: appointment._id,
        doctor_id: appointment.doctor_id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// ===== UPDATE Appointment Status =====
router.put("/appointments/:appointmentId/status", auth, async (req, res) => {
  try {
    console.log("🔍 Update appointment status request");
    console.log("🔍 User role:", req.userRole);
    console.log("🔍 User ID:", req.userId);
    
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log("❌ Appointment not found:", appointmentId);
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if this appointment belongs to this attorney
    // Use the same logic as the appointments fetching endpoint
    let attorney = await Attorney.findById(req.userId).lean();
    let attorneyId = req.userId;
    let codeAttorneyId = null;
    
    // Always try to find the corresponding Code record based on email
    const Code = require("../models/Code");
    if (attorney && attorney.attorneyEmail) {
      console.log("🔍 Attorney found in Attorney model, looking for corresponding Code record...");
      const codeAttorney = await Code.findOne({ email: attorney.attorneyEmail });
      
      if (codeAttorney) {
        console.log("✅ Corresponding Code record found:", codeAttorney.name);
        codeAttorneyId = codeAttorney._id;
      } else {
        console.log("⚠️ No corresponding Code record found for email:", attorney.attorneyEmail);
      }
    }
    
    // If not found in Attorney model, check Code model directly
    if (!attorney) {
      console.log("🔍 Attorney not found in Attorney model, checking Code model...");
      const codeAttorney = await Code.findById(req.userId);
      
      if (codeAttorney) {
        console.log("✅ Attorney found in Code model:", codeAttorney.name);
        attorney = codeAttorney;
        attorneyId = codeAttorney._id;
        codeAttorneyId = codeAttorney._id;
      }
    }

    if (!attorney) {
      return res.status(404).json({ message: "Attorney not found" });
    }

    // Build the same search criteria as used in appointments fetching
    let attorneyIds = [];
    
    if (attorneyId) {
      attorneyIds.push(attorneyId);
    }
    if (codeAttorneyId) {
      attorneyIds.push(codeAttorneyId);
    }
    
    // Check both doctor_id and attorney_id fields against all possible attorney IDs
    const isDoctorAppointment = appointment.doctor_id && attorneyIds.some(id => 
      appointment.doctor_id.toString() === id.toString()
    );
    const isAttorneyAppointment = appointment.attorney_id && attorneyIds.some(id => 
      appointment.attorney_id.toString() === id.toString()
    );
    
    console.log("🔍 Attorney IDs to check:", attorneyIds);
    console.log("🔍 isDoctorAppointment:", isDoctorAppointment);
    console.log("🔍 isAttorneyAppointment:", isAttorneyAppointment);
    
    if (!isDoctorAppointment && !isAttorneyAppointment) {
      console.log("❌ Unauthorized: Appointment does not belong to this attorney");
      console.log("❌ Attorney IDs:", attorneyIds);
      console.log("❌ Appointment doctor_id:", appointment.doctor_id);
      console.log("❌ Appointment attorney_id:", appointment.attorney_id);
      return res.status(403).json({ message: "You can only update your own appointments" });
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    console.log("✅ Appointment status updated:", appointmentId, "->", status);

    res.json({
      message: "Appointment status updated successfully",
      appointment: {
        id: appointment._id,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error("❌ Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
});

// ===== GET Attorney Consultations =====
router.get("/consultations", auth, async (req, res) => {
  try {
    // Check if user is an attorney
    if (req.userRole !== "Attorney") {
      return res.status(403).json({ message: "Only attorneys can access this endpoint" });
    }

    // Get attorney ID directly from req.userId (for attorneys, userId is their attorney ID)
    const attorneyId = req.userId;
    
    console.log("🔍 Fetching consultations for attorney:", attorneyId);
    
    // First, let's see ALL consultations to debug
    const allConsultations = await Consultation.find({}).lean();
    console.log("🔍 Total consultations in DB:", allConsultations.length);
    allConsultations.forEach(c => {
      console.log(`  - Consultation ${c._id}: doctor_id=${c.doctor_id}, patient_id=${c.patient_id}, status=${c.status}`);
    });
    
    const consultations = await Consultation.find({ doctor_id: attorneyId })
      .populate('patient_id', 'name email')
      .sort({ updatedAt: -1 })
      .lean();

    console.log("🔍 Found consultations for this attorney:", consultations.length);

    const formattedConsultations = consultations.map(consultation => ({
      id: consultation._id,
      patient_name: consultation.patient_id?.name || "Unknown",
      patient_email: consultation.patient_id?.email || "",
      status: consultation.status,
      subject: consultation.subject || "",
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt
    }));

    res.json({
      consultations: formattedConsultations,
      total: formattedConsultations.length
    });
  } catch (error) {
    console.error("Get doctor consultations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== SEND Message in Consultation (Attorney) =====
router.post("/consultation/:consultationId/message", auth, async (req, res) => {
  try {
    // Check if user is an attorney
    if (req.userRole !== "Attorney") {
      return res.status(403).json({ message: "Only attorneys can send messages" });
    }

    const { consultationId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get attorney ID directly from req.userId
    const attorneyId = req.userId;

    // Check if consultation exists and belongs to this attorney
    const consultation = await Consultation.findById(consultationId).populate('doctor_id', 'attorneyName');
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    if (consultation.doctor_id._id.toString() !== attorneyId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this consultation" });
    }

    // Create message
    const consultationMessage = new ConsultationMessage({
      consultation_id: consultationId,
      sender_id: req.userId,
      sender_role: 'Attorney',
      message: message.trim(),
      attorney_name: consultation.doctor_id.attorneyName || null
    });

    await consultationMessage.save();

    // Update consultation updatedAt
    await Consultation.findByIdAndUpdate(consultationId, { updatedAt: new Date() });

    res.status(201).json({
      message: "Message sent successfully",
      messageData: {
        id: consultationMessage._id,
        message: consultationMessage.message,
        sender_role: consultationMessage.sender_role,
        attorney_name: consultationMessage.attorney_name,
        createdAt: consultationMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET Messages for Consultation (Attorney) =====
router.get("/consultation/:consultationId/messages", auth, async (req, res) => {
  try {
    // Check if user is an attorney
    if (req.userRole !== "Attorney") {
      return res.status(403).json({ message: "Only attorneys can access this endpoint" });
    }

    const { consultationId } = req.params;

    // Get attorney ID directly from req.userId
    const attorneyId = req.userId;

    // Check if consultation exists and belongs to this attorney
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.doctor_id.toString() !== attorneyId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this consultation" });
    }

    // Get all messages for this consultation
    const messages = await ConsultationMessage.find({ consultation_id: consultationId })
      .populate('sender_id', 'name')
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      message: msg.message,
      sender_role: msg.sender_role,
      sender_name: msg.sender_id?.name || "Unknown",
      createdAt: msg.createdAt,
      read: msg.read
    }));

    // Mark client messages as read
    await ConsultationMessage.updateMany(
      { consultation_id: consultationId, sender_role: 'Client', read: false },
      { read: true }
    );

    res.json({
      messages: formattedMessages,
      total: formattedMessages.length
    });
  } catch (error) {
    console.error("Get consultation messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE APPOINTMENT =====
router.delete("/appointments/:appointmentId", auth, async (req, res) => {
  try {
    if (req.userRole !== "Attorney") {
      return res.status(403).json({ message: "Only attorneys can delete appointments" });
    }

    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify that this appointment belongs to the attorney
    if (appointment.doctor_id.toString() !== req.user.id && appointment.attorney_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own appointments" });
    }

    // Soft delete
    appointment.isActive = false;
    appointment.deletedAt = new Date();
    appointment.deletionReason = "Attorney deletion";
    await appointment.save();

    console.log(`✅ Attorney deleted appointment: ${appointmentId}`);

    res.json({
      message: "Appointment deleted successfully",
      appointment: {
        id: appointment._id,
        status: "deleted"
      }
    });
  } catch (error) {
    console.error("Attorney delete appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;