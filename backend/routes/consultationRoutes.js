const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Attorney = require("../models/Attorney");
const User = require("../models/User");
const Consultation = require("../models/Consultation");
const ConsultationMessage = require("../models/ConsultationMessage");

// ===== GET ALL ATTORNEYS FOR CONSULTATION =====
router.get("/attorneys", auth, async (req, res) => {
  try {
    console.log("🔍 Fetching all attorneys for consultation...");
    
    const attorneys = await Attorney.find({ isActive: true })
      .select('attorneyName attorneyEmail specialization experience fees')
      .lean();

    const formattedAttorneys = attorneys.map(attorney => ({
      id: attorney._id,
      name: attorney.attorneyName,
      email: attorney.attorneyEmail,
      specialization: attorney.specialization || 'General Practice',
      experience: attorney.experience || 0,
      fees: attorney.fees || 0
    }));

    console.log(`✅ Found ${formattedAttorneys.length} attorneys`);
    res.json({
      success: true,
      attorneys: formattedAttorneys,
      total: formattedAttorneys.length
    });
  } catch (error) {
    console.error('❌ Get consultation attorneys error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch attorneys',
      error: error.message 
    });
  }
});

// ===== CREATE NEW CONSULTATION =====
router.post("/create", auth, async (req, res) => {
  try {
    console.log("🔍 Creating new consultation...");
    const { attorney_id } = req.body;
    const patient_id = req.userId;

    if (!attorney_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Attorney ID is required' 
      });
    }

    // Check if attorney exists
    const attorney = await Attorney.findById(attorney_id);
    if (!attorney) {
      return res.status(404).json({ 
        success: false,
        message: 'Attorney not found' 
      });
    }

    // Check if consultation already exists
    const existingConsultation = await Consultation.findOne({
      patient_id,
      doctor_id: attorney_id,
      status: { $in: ['Pending', 'Active'] }
    });

    if (existingConsultation) {
      return res.status(400).json({ 
        success: false,
        message: 'Consultation already exists with this attorney' 
      });
    }

    // Create new consultation
    const consultation = new Consultation({
      patient_id,
      doctor_id: attorney_id,
      status: 'Active'
    });

    await consultation.save();
    console.log('✅ Consultation created:', consultation._id);

    // Populate attorney details for response
    await consultation.populate('doctor_id', 'attorneyName specialization');

    res.status(201).json({
      success: true,
      message: 'Consultation created successfully',
      consultation: {
        id: consultation._id,
        attorney_name: consultation.doctor_id?.attorneyName || 'Unknown',
        specialization: consultation.doctor_id?.specialization || 'General Practice',
        status: consultation.status,
        createdAt: consultation.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Create consultation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create consultation',
      error: error.message 
    });
  }
});

// ===== GET USER CONSULTATIONS =====
router.get("/my-consultations", auth, async (req, res) => {
  try {
    console.log("🔍 Fetching user consultations...");
    const patient_id = req.userId;

    const consultations = await Consultation.find({ patient_id })
      .populate('doctor_id', 'attorneyName specialization')
      .sort({ updatedAt: -1 })
      .lean();

    const formattedConsultations = consultations.map(consultation => ({
      id: consultation._id,
      attorney_name: consultation.doctor_id?.attorneyName || 'Unknown',
      specialization: consultation.doctor_id?.specialization || 'General Practice',
      status: consultation.status,
      subject: consultation.subject || '',
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt
    }));

    console.log(`✅ Found ${formattedConsultations.length} consultations`);
    res.json({
      success: true,
      consultations: formattedConsultations,
      total: formattedConsultations.length
    });
  } catch (error) {
    console.error('❌ Get user consultations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch consultations',
      error: error.message 
    });
  }
});

// ===== SEND MESSAGE IN CONSULTATION =====
router.post("/:consultationId/message", auth, async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { message } = req.body;
    const sender_id = req.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Message is required' 
      });
    }

    // Check if consultation exists and belongs to this user
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultation not found' 
      });
    }

    if (consultation.patient_id.toString() !== sender_id) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access to this consultation' 
      });
    }

    // Create message
    const consultationMessage = new ConsultationMessage({
      consultation_id: consultationId,
      sender_id,
      sender_role: 'Client',
      message: message.trim(),
      attorney_name: consultation.doctor_id.attorneyName || null
    });

    await consultationMessage.save();

    // Update consultation status and timestamp
    if (consultation.status === 'Pending') {
      consultation.status = 'Active';
    }
    consultation.updatedAt = new Date();
    await consultation.save();

    console.log('✅ Message sent in consultation:', consultationMessage._id);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageData: {
        id: consultationMessage._id,
        message: consultationMessage.message,
        sender_role: consultationMessage.sender_role,
        attorney_name: consultationMessage.attorney_name,
        createdAt: consultationMessage.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Send consultation message error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

// ===== GET MESSAGES FOR CONSULTATION =====
router.get("/:consultationId/messages", auth, async (req, res) => {
  try {
    const { consultationId } = req.params;
    const userId = req.userId;

    // Check if consultation exists and belongs to this user
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultation not found' 
      });
    }

    if (consultation.patient_id.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access to this consultation' 
      });
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
      sender_name: msg.sender_id?.name || 'Unknown',
      createdAt: msg.createdAt
    }));

    // Mark attorney messages as read
    await ConsultationMessage.updateMany(
      { consultation_id: consultationId, sender_role: 'Attorney', read: false },
      { read: true }
    );

    console.log(`✅ Found ${formattedMessages.length} messages`);
    res.json({
      success: true,
      messages: formattedMessages,
      total: formattedMessages.length
    });

  } catch (error) {
    console.error('❌ Get consultation messages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch messages',
      error: error.message 
    });
  }
});

module.exports = router;
