const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attorney = require("../models/Attorney");
const Appointment = require("../models/Appointment");
const Admin = require("../models/Admin");
const Feedback = require("../models/Feedback");
const Consultation = require("../models/Consultation");
const ConsultationMessage = require("../models/ConsultationMessage");
const Service = require("../models/Service");
const Code = require("../models/Code");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// ===== TEST ROUTE =====
router.get("/test", (req, res) => {
  res.json({ message: "Admin routes are working!" });
});

// ===== ADMIN LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Admin login attempt:", { email });

    // Check for default admin
    const defaultAdminEmail = "krishnapambhar@justice.com";
    const defaultAdminPassword = "krishna123";
    
    if (email === defaultAdminEmail && password === defaultAdminPassword) {
      console.log("✅ Default admin credentials match");
      
      // Check if user exists
      let user = await User.findOne({ email: defaultAdminEmail });
      
      if (!user) {
        // Create admin user
        user = new User({
          name: "Krishna Pambhar",
          email: defaultAdminEmail,
          password: defaultAdminPassword,
          role: "Admin"
        });
        await user.save();
        console.log("✅ Created admin user");
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secretKey",
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Admin login successful",
        token,
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // For other admins
    const user = await User.findOne({ email });
    
    if (!user || user.role !== "Admin") {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ADMIN DASHBOARD =====
router.get("/dashboard", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access dashboard" });
    }

    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAttorneys = await Attorney.countDocuments({ isActive: true });
    const totalAppointments = await Appointment.countDocuments({ isActive: true });
    const pendingAppointments = await Appointment.countDocuments({ isActive: true, status: "Pending" });
    const confirmedAppointments = await Appointment.countDocuments({ isActive: true, status: "Confirmed" });
    const completedAppointments = await Appointment.countDocuments({ isActive: true, status: "Completed" });
    const expiredAppointments = await Appointment.countDocuments({ isActive: true, status: "Expired" });
    const totalFeedback = await Feedback.countDocuments({ isActive: true });

    res.json({
      totalUsers,
      totalAttorneys,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      expiredAppointments,
      totalFeedback
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET ALL APPOINTMENTS =====
router.get("/appointments", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access appointments" });
    }

    console.log("🔍 Admin fetching all appointments with complete details");

    // Get all appointments with full user and attorney details
    const appointments = await Appointment.find({ isActive: true })
      .populate('user_id', 'name email phone role profilePicture createdAt updatedAt')
      .populate('doctor_id', 'attorneyName attorneyEmail attorneyPhone specialization fees qualification experience barNumber officeAddress createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${appointments.length} appointments`);

    // Format appointments with complete details
    const formattedAppointments = appointments.map(apt => {
      // Complete user information
      const userInfo = {
        id: apt.user_id?._id || apt.user_id,
        name: apt.user_id?.name || apt.personalInfo?.name || "Unknown User",
        email: apt.user_id?.email || apt.personalInfo?.email || "",
        phone: apt.user_id?.phone || apt.personalInfo?.phone || "",
        role: apt.user_id?.role || "Client",
        profilePicture: apt.user_id?.profilePicture || "",
        createdAt: apt.user_id?.createdAt,
        updatedAt: apt.user_id?.updatedAt,
        signupDate: apt.user_id?.createdAt ? new Date(apt.user_id.createdAt).toLocaleDateString() : 'N/A',
        signupTime: apt.user_id?.createdAt ? new Date(apt.user_id.createdAt).toLocaleTimeString() : 'N/A'
      };

      // Complete attorney information
      const attorneyInfo = {
        id: apt.doctor_id?._id || apt.doctor_id,
        name: apt.doctor_id?.attorneyName || apt.attorneyName || "Unknown Attorney",
        email: apt.doctor_id?.attorneyEmail || "",
        phone: apt.doctor_id?.attorneyPhone || "",
        specialization: apt.doctor_id?.specialization || apt.attorneySpecialization || "General Practice",
        fees: apt.doctor_id?.fees || apt.attorneyFees || 0,
        qualification: apt.doctor_id?.qualification || "",
        experience: apt.doctor_id?.experience || "",
        barNumber: apt.doctor_id?.barNumber || "",
        officeAddress: apt.doctor_id?.officeAddress || "",
        createdAt: apt.doctor_id?.createdAt,
        updatedAt: apt.doctor_id?.updatedAt
      };

      return {
        id: apt._id,
        date: new Date(apt.date).toISOString().split('T')[0],
        time: apt.time,
        status: apt.status || "Pending",
        
        // Appointment details from user booking
        subject: apt.subject || "",
        purpose: apt.purpose || "",
        caseSummary: apt.caseSummary || "",
        documents: apt.documents || "",
        desiredOutcome: apt.desiredOutcome || "",
        symptoms: apt.symptoms || "",
        notes: apt.notes || "",
        
        // Complete user information
        user: userInfo,
        patient: userInfo, // Keep for backward compatibility
        
        // Complete attorney information  
        attorney: attorneyInfo,
        doctor: attorneyInfo, // Keep for backward compatibility
        
        // Additional details
        attorneyName: attorneyInfo.name,
        attorneySpecialization: attorneyInfo.specialization,
        attorneyFees: attorneyInfo.fees,
        
        // Timestamps
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
        createdDate: apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : 'N/A',
        createdTime: apt.createdAt ? new Date(apt.createdAt).toLocaleTimeString() : 'N/A',
        lastUpdatedDate: apt.updatedAt ? new Date(apt.updatedAt).toLocaleDateString() : 'N/A',
        lastUpdatedTime: apt.updatedAt ? new Date(apt.updatedAt).toLocaleTimeString() : 'N/A'
      };
    });

    res.json({
      appointments: formattedAppointments,
      total: formattedAppointments.length
    });
  } catch (error) {
    console.error("Admin appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== UPDATE APPOINTMENT STATUS =====
router.put("/appointments/:appointmentId/status", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can update appointment status" });
    }

    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update status
    appointment.status = status;
    appointment.updatedAt = new Date();
    await appointment.save();

    console.log(`✅ Admin updated appointment ${appointmentId} status to: ${status}`);

    res.json({
      message: "Appointment status updated successfully",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        updatedAt: appointment.updatedAt
      }
    });
  } catch (error) {
    console.error("Admin update appointment status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE APPOINTMENT =====
router.delete("/appointments/:appointmentId", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete appointments" });
    }

    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Soft delete
    appointment.isActive = false;
    appointment.deletedAt = new Date();
    appointment.deletionReason = "Admin deletion";
    await appointment.save();

    console.log(`✅ Admin soft deleted appointment: ${appointmentId}`);

    res.json({
      message: "Appointment deleted successfully",
      appointment: {
        id: appointment._id,
        status: "deleted"
      }
    });
  } catch (error) {
    console.error("Admin delete appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET ALL USERS =====
router.get("/users", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access users" });
    }

    const users = await User.find({ isActive: true })
      .select('name email role isSocialLogin profilePicture provider providerId createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSocialLogin: user.isSocialLogin,
      profilePicture: user.profilePicture,
      provider: user.provider,
      providerId: user.providerId,
      signupDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      signupTime: user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : 'N/A',
      lastLoginDate: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A',
      lastLoginTime: user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString() : 'N/A'
    }));

    res.json({
      users: formattedUsers,
      total: formattedUsers.length
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE USER (SOFT DELETE) =====
router.delete("/users/:id", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark user as inactive instead of deleting
    user.isActive = false;
    user.deletedAt = new Date();
    user.deletionReason = "Admin soft delete";
    await user.save();

    console.log("🔒 User marked as inactive (not deleted):", user.email);

    res.json({ 
      message: "User marked as inactive. Data preserved in database.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        status: "inactive",
        deletedAt: user.deletedAt
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== CODES API ROUTES =====

// CHECK ATTORNEY CODES (ACTIVE ONLY)
router.post("/codes/check", async (req, res) => {
  try {
    const { attorneyCode } = req.body;

    // Find attorney by attorney code in codes table (only active ones)
    const attorney = await Code.findOne({
      attorneyCode: attorneyCode,
      isActive: true
    });

    if (attorney) {
      res.json({ exists: true, message: "Attorney code found in codes table" });
    } else {
      res.json({ exists: false, message: "Attorney code not found in codes table" });
    }
  } catch (error) {
    console.error("Check codes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL CODES (ACTIVE ONLY)
router.get("/codes", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access codes" });
    }

    const codes = await Code.find({ isActive: true }).sort({ createdAt: -1 });
    
    const formattedCodes = codes.map(code => ({
      id: code._id,
      name: code.name,
      email: code.email,
      phone: code.phone,
      gender: code.gender,
      qualification: code.qualification,
      joiningDate: code.joiningDate,
      attorneyCode: code.attorneyCode,
      createdAt: code.createdAt,
      updatedAt: code.updatedAt
    }));

    res.json({ codes: formattedCodes });
  } catch (error) {
    console.error("Get codes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET DELETED/INACTIVE CODES (FOR ADMIN REFERENCE)
router.get("/codes/deleted", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access deleted codes" });
    }

    const codes = await Code.find({ isActive: false }).sort({ deletedAt: -1 });
    
    const formattedCodes = codes.map(code => ({
      id: code._id,
      name: code.name,
      email: code.email,
      phone: code.phone,
      gender: code.gender,
      qualification: code.qualification,
      joiningDate: code.joiningDate,
      attorneyCode: code.attorneyCode,
      deletedAt: code.deletedAt,
      deletionReason: code.deletionReason,
      createdAt: code.createdAt,
      updatedAt: code.updatedAt
    }));

    res.json({ deletedCodes: formattedCodes });
  } catch (error) {
    console.error("Get deleted codes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE NEW CODE
router.post("/codes", auth, async (req, res) => {
  try {
    console.log("🔍 Admin Codes Debug - User role:", req.userRole);
    console.log("🔍 Admin Codes Debug - Request body:", req.body);
    
    if (req.userRole !== "Admin") {
      console.log("❌ Access denied - User role:", req.userRole);
      return res.status(403).json({ message: "Only admins can create codes" });
    }

    const { name, email, phone, gender, qualification, joiningDate, attorneyCode } = req.body;

    // Check if attorney code already exists
    const existingCode = await Code.findOne({ attorneyCode });
    if (existingCode) {
      return res.status(400).json({ message: "Attorney code already exists" });
    }

    // Create new code
    const newCode = new Code({
      name,
      email,
      phone,
      gender,
      qualification,
      joiningDate,
      attorneyCode
    });

    await newCode.save();

    res.status(201).json({
      message: "Attorney created successfully",
      code: {
        id: newCode._id,
        name: newCode.name,
        email: newCode.email,
        phone: newCode.phone,
        gender: newCode.gender,
        qualification: newCode.qualification,
        joiningDate: newCode.joiningDate,
        attorneyCode: newCode.attorneyCode
      }
    });
  } catch (error) {
    console.error("Create code error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE CODE
router.put("/codes/:id", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can update codes" });
    }

    const { name, email, phone, gender, qualification, joiningDate, attorneyCode } = req.body;
    const codeId = req.params.id;

    const code = await Code.findById(codeId);
    if (!code) {
      return res.status(404).json({ message: "Attorney not found" });
    }

    // Check if attorney code is being changed and if it already exists
    if (attorneyCode !== code.attorneyCode) {
      const existingCode = await Code.findOne({ attorneyCode });
      if (existingCode) {
        return res.status(400).json({ message: "Attorney code already exists" });
      }
    }

    // Update code
    code.name = name;
    code.email = email;
    code.phone = phone;
    code.gender = gender;
    code.qualification = qualification;
    code.joiningDate = joiningDate;
    code.attorneyCode = attorneyCode;

    await code.save();

    res.json({
      message: "Attorney updated successfully",
      code: {
        id: code._id,
        name: code.name,
        email: code.email,
        phone: code.phone,
        gender: code.gender,
        qualification: code.qualification,
        joiningDate: code.joiningDate,
        attorneyCode: code.attorneyCode
      }
    });
  } catch (error) {
    console.error("Update code error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE CODE (SOFT DELETE)
router.delete("/codes/:id", auth, async (req, res) => {
  try {
    console.log("🔍 Delete Code Debug - User role:", req.userRole);
    console.log("🔍 Delete Code Debug - Code ID:", req.params.id);
    
    if (req.userRole !== "Admin") {
      console.log("❌ Access denied - User role:", req.userRole);
      return res.status(403).json({ message: "Only admins can delete codes" });
    }

    const codeId = req.params.id;
    const code = await Code.findById(codeId);
    
    if (!code) {
      console.log("❌ Attorney not found - ID:", codeId);
      return res.status(404).json({ message: "Attorney not found" });
    }

    // Soft delete - mark as inactive instead of deleting
    code.isActive = false;
    code.deletedAt = new Date();
    code.deletionReason = "Admin soft delete";
    await code.save();

    console.log("✅ Attorney marked as inactive (not deleted):", code.name);

    res.json({ 
      message: "Attorney deleted successfully",
      attorney: {
        id: code._id,
        name: code.name,
        email: code.email,
        status: "inactive",
        deletedAt: code.deletedAt
      }
    });
  } catch (error) {
    console.error("Delete code error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// RESTORE DELETED CODE
router.put("/codes/:id/restore", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can restore codes" });
    }

    const codeId = req.params.id;
    const code = await Code.findById(codeId);
    
    if (!code) {
      return res.status(404).json({ message: "Attorney not found" });
    }

    if (code.isActive) {
      return res.status(400).json({ message: "Attorney is already active" });
    }

    // Restore the code
    code.isActive = true;
    code.deletedAt = null;
    code.deletionReason = null;
    await code.save();

    console.log("✅ Attorney restored successfully:", code.name);

    res.json({
      message: "Attorney restored successfully",
      attorney: {
        id: code._id,
        name: code.name,
        email: code.email,
        status: "active"
      }
    });
  } catch (error) {
    console.error("Restore code error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ADMIN SERVICES ROUTES =====

// Multer setup for service icon uploads
const serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/services/"); // Create uploads/services directory
  },
  filename: function (req, file, cb) {
    cb(null, "service_" + Date.now() + path.extname(file.originalname));
  },
});

const serviceUpload = multer({ 
  storage: serviceStorage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// GET All Services (Admin)
router.get("/services", auth, async (req, res) => {
  try {
    console.log("🔍 Admin fetching all services");
    
    const services = await Service.find({ is_active: true })
      .select('service_name description price category icon icon_file is_active created_at updated_at')
      .sort({ created_at: -1 })
      .lean();

    // Transform _id to id for frontend consistency
    const transformedServices = services.map(service => ({
      id: service._id,
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      category: service.category,
      icon: service.icon,
      icon_file: service.icon_file,
      is_active: service.is_active,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));

    console.log(`🔍 Found ${transformedServices.length} active services`);
    res.json({ services: transformedServices });
  } catch (error) {
    console.error("Get admin services error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE Service (Admin)
router.post("/services", auth, serviceUpload.single("iconFile"), async (req, res) => {
  try {
    console.log("🔍 Admin creating service");
    console.log("🔍 Request body:", req.body);
    console.log("🔍 Uploaded file:", req.file);
    
    const { service_name, description, category, icon } = req.body;
    
    // Validation
    if (!service_name || service_name.trim().length === 0) {
      return res.status(400).json({ message: "Service name is required" });
    }
    
    if (service_name.trim().length < 3) {
      return res.status(400).json({ message: "Service name must be at least 3 characters" });
    }
    
    if (service_name.trim().length > 100) {
      return res.status(400).json({ message: "Service name cannot exceed 100 characters" });
    }
    
    if (description && description.length > 500) {
      return res.status(400).json({ message: "Description cannot exceed 500 characters" });
    }

    // Create service
    const newService = new Service({
      service_name: service_name.trim(),
      description: description ? description.trim() : "",
      category: category || "Legal Service",
      icon: icon || "Custom",
      icon_file: req.file ? req.file.filename : null
    });

    await newService.save();
    console.log("✅ Service created successfully:", newService._id);

    res.status(201).json({
      message: "Service created successfully",
      service: {
        id: newService._id,
        service_name: newService.service_name,
        description: newService.description,
        category: newService.category,
        icon: newService.icon,
        icon_file: newService.icon_file,
        is_active: newService.is_active,
        created_at: newService.created_at,
        updated_at: newService.updated_at
      }
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Service (Admin)
router.put("/services/:id", auth, serviceUpload.single("iconFile"), async (req, res) => {
  try {
    console.log("🔍 Admin updating service:", req.params.id);
    
    const { service_name, description, category, icon } = req.body;
    const serviceId = req.params.id;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    // Validation
    if (!service_name || service_name.trim().length === 0) {
      return res.status(400).json({ message: "Service name is required" });
    }
    
    if (service_name.trim().length < 3) {
      return res.status(400).json({ message: "Service name must be at least 3 characters" });
    }
    
    if (service_name.trim().length > 100) {
      return res.status(400).json({ message: "Service name cannot exceed 100 characters" });
    }
    
    if (description && description.length > 500) {
      return res.status(400).json({ message: "Description cannot exceed 500 characters" });
    }

    // Update service
    service.service_name = service_name.trim();
    service.description = description ? description.trim() : "";
    service.category = category || "Legal Service";
    service.icon = icon || "Custom";
    
    // Update icon file if new one uploaded
    if (req.file) {
      service.icon_file = req.file.filename;
    }
    
    service.updated_at = new Date();
    await service.save();
    
    console.log("✅ Service updated successfully:", service._id);

    res.json({
      message: "Service updated successfully",
      service: {
        id: service._id,
        service_name: service.service_name,
        description: service.description,
        category: service.category,
        icon: service.icon,
        icon_file: service.icon_file,
        is_active: service.is_active,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE Service (Admin - SOFT DELETE)
router.delete("/services/:id", auth, async (req, res) => {
  try {
    console.log("🔍 Admin deleting service:", req.params.id);
    
    const serviceId = req.params.id;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    // Soft delete - mark as inactive instead of deleting
    service.is_active = false;
    service.deletedAt = new Date();
    service.deletionReason = "Admin soft delete";
    await service.save();
    
    console.log("✅ Service marked as inactive (not deleted):", service._id);

    res.json({ 
      message: "Service deleted successfully. Data preserved in database.",
      service: {
        id: service._id,
        service_name: service.service_name,
        category: service.category,
        status: "inactive",
        deletedAt: service.deletedAt
      }
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET DELETED/INACTIVE SERVICES (FOR ADMIN REFERENCE)
router.get("/services/deleted", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access deleted services" });
    }

    const services = await Service.find({ is_active: false }).sort({ deletedAt: -1 });
    
    const formattedServices = services.map(service => ({
      id: service._id,
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      category: service.category,
      icon: service.icon,
      icon_file: service.icon_file,
      deletedAt: service.deletedAt,
      deletionReason: service.deletionReason,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));

    res.json({ deletedServices: formattedServices });
  } catch (error) {
    console.error("Get deleted services error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// RESTORE DELETED SERVICE
router.put("/services/:id/restore", auth, async (req, res) => {
  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can restore services" });
    }

    const serviceId = req.params.id;
    
    // Find the inactive service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.is_active) {
      return res.status(400).json({ message: "Service is already active" });
    }

    // Restore the service
    service.is_active = true;
    service.deletedAt = null;
    service.deletionReason = null;
    await service.save();

    console.log("✅ Service restored successfully:", service._id);

    res.json({ 
      message: "Service restored successfully",
      service: {
        id: service._id,
        service_name: service.service_name,
        category: service.category,
        status: "active"
      }
    });
  } catch (error) {
    console.error("Restore service error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET All Feedback (Admin) =====
router.get("/feedback", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const { status } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    const feedbacks = await Feedback.find(query)
      .populate('user_id', 'name email phone')
      .populate('responded_by', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const formattedFeedbacks = feedbacks.map(feedback => ({
      id: feedback._id,
      subject: feedback.subject,
      message: feedback.message,
      rating: feedback.rating,
      status: feedback.status,
      admin_response: feedback.admin_response || "",
      responded_at: feedback.responded_at || null,
      user: {
        id: feedback.user_id?._id,
        name: feedback.user_id?.name || "Unknown",
        email: feedback.user_id?.email || "Unknown",
        phone: feedback.user_id?.phone || "Unknown"
      },
      responded_by: feedback.responded_by ? {
        id: feedback.responded_by._id,
        name: feedback.responded_by.name,
        email: feedback.responded_by.email
      } : null,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt
    }));

    res.json({
      feedbacks: formattedFeedbacks,
      total: formattedFeedbacks.length
    });
  } catch (error) {
    console.error("Admin get feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== UPDATE Feedback Status (Admin) =====
router.put("/feedback/:id/status", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ["Pending", "Reviewed", "Resolved", "Archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Valid statuses are: Pending, Reviewed, Resolved, Archived" 
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'name email')
      .lean();

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({
      message: "Feedback status updated successfully",
      feedback: {
        id: feedback._id,
        subject: feedback.subject,
        status: feedback.status,
        user: {
          name: feedback.user_id?.name,
          email: feedback.user_id?.email
        }
      }
    });
  } catch (error) {
    console.error("Admin update feedback status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== RESPOND to Feedback (Admin) =====
router.put("/feedback/:id/respond", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const { admin_response, status } = req.body;
    const { id } = req.params;

    if (!admin_response) {
      return res.status(400).json({ message: "Admin response is required" });
    }

    // Update feedback with response
    const updateData = {
      admin_response,
      responded_by: req.userId,
      responded_at: new Date()
    };

    // Update status if provided
    if (status) {
      const validStatuses = ["Pending", "Reviewed", "Resolved", "Archived"];
      if (validStatuses.includes(status)) {
        updateData.status = status;
      }
    } else {
      // Default to Reviewed if status not provided
      updateData.status = "Reviewed";
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user_id', 'name email')
      .populate('responded_by', 'name email')
      .lean();

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({
      message: "Response added successfully",
      feedback: {
        id: feedback._id,
        subject: feedback.subject,
        message: feedback.message,
        admin_response: feedback.admin_response,
        status: feedback.status,
        responded_at: feedback.responded_at,
        user: {
          name: feedback.user_id?.name,
          email: feedback.user_id?.email
        },
        responded_by: feedback.responded_by ? {
          name: feedback.responded_by.name,
          email: feedback.responded_by.email
        } : null
      }
    });
  } catch (error) {
    console.error("Admin respond to feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE Feedback (Admin) =====
router.delete("/feedback/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Admin delete feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET All Consultations (Admin) =====
router.get("/consultations", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const consultations = await Consultation.find({})
      .populate('patient_id', 'name email phone')
      .populate({
        path: 'doctor_id',
        populate: {
          path: 'userId',
          select: 'name email specialization'
        }
      })
      .sort({ updatedAt: -1 })
      .lean();

    const formattedConsultations = consultations.map(consultation => ({
      id: consultation._id,
      client: {
        id: consultation.patient_id?._id,
        name: consultation.patient_id?.name || "Unknown",
        email: consultation.patient_id?.email || "",
        phone: consultation.patient_id?.phone || ""
      },
      attorney: {
        id: consultation.doctor_id?._id,
        name: consultation.doctor_id?.userId?.name || "Unknown",
        email: consultation.doctor_id?.userId?.email || "",
        specialization: consultation.doctor_id?.specialization || ""
      },
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
    console.error("Admin get consultations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET Messages for Consultation (Admin) =====
router.get("/consultations/:consultationId/messages", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint" });
    }

    const { consultationId } = req.params;

    // Get all messages for this consultation
    const messages = await ConsultationMessage.find({ consultation_id: consultationId })
      .populate('sender_id', 'name email')
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      consultation_id: msg.consultation_id,
      sender_id: msg.sender_id?._id,
      sender_name: msg.sender_id?.name || "Unknown",
      sender_email: msg.sender_id?.email || "Unknown",
      sender_role: msg.sender_role,
      message: msg.message,
      createdAt: msg.createdAt
    }));

    res.json({
      messages: formattedMessages,
      total: formattedMessages.length
    });
  } catch (error) {
    console.error("Admin get consultation messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== SEND Reply Message in Consultation (Admin) =====
router.post("/consultations/:consultationId/reply", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Only admins can reply to consultations" });
    }

    const { consultationId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Check if consultation exists
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // Create message as Admin (sent as Attorney for consistency)
    const consultationMessage = new ConsultationMessage({
      consultation_id: consultationId,
      sender_id: req.userId, // Admin's user ID
      sender_role: 'Attorney',
      message: `[Admin Reply] ${message.trim()}`
    });

    await consultationMessage.save();

    // Update consultation updatedAt
    await Consultation.findByIdAndUpdate(consultationId, { updatedAt: new Date() });

    res.status(201).json({
      message: "Reply sent successfully",
      messageData: {
        id: consultationMessage._id,
        message: consultationMessage.message,
        sender_role: consultationMessage.sender_role,
        createdAt: consultationMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Admin reply to consultation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
