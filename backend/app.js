const express = require("express")
const dbConnect = require("./config/dbConnect")
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
const Path = require("path");
// TODO: Add passport imports after fixing OAuth setup
// const passport = require("passport");
// const session = require("express-session");

// Load environment variables
require('dotenv').config();

// TODO: Enable Passport configuration after fixing OAuth setup
// require('./config/passport')(passport);

// TODO: Enable session middleware for Passport after fixing OAuth setup
// app.use(session({
//   secret: process.env.JWT_SECRET || 'secretKey',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } // Set to true in production with HTTPS
// }));

// TODO: Initialize Passport after fixing OAuth setup
// app.use(passport.initialize());
// app.use(passport.session());


const userRoute = require("./routes/userRoutes");
const attorneyRoute = require("./routes/doctor"); // attorney routes
const adminRoute = require("./routes/admin");
const aiAdvisorRoute = require("./routes/aiAdvisor");
const servicesRoute = require("./routes/services");
const consultationRoute = require("./routes/consultationRoutes");

app.use(express.json())
app.use(cors());

// Serve static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('uploads'));

// Add a test route to verify uploads directory
app.get('/uploads-test', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, 'uploads');
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Cannot read uploads directory', details: err.message });
    }
    
    res.json({ 
      message: 'Uploads directory accessible',
      files: files.slice(0, 10), // Show first 10 files
      totalFiles: files.length,
      uploadsPath: uploadsDir
    });
  });
});

app.use('/images', express.static(Path.join(__dirname, 'public/images')));

// Log only API route path for backend calls
app.use((req, res, next) => {
    const url = req.originalUrl || req.url
    if (url.startsWith('/user') || url.startsWith('/attorney') || url.startsWith('/admin') || url.startsWith('/services')) {
        console.log(url)
    }
    next()
})

// app.use("/", (req, res) => {
//      res.send("Welcome to the Justice App API");
// })

app.use('/user', userRoute);

// Consultation routes
app.use('/consultation', consultationRoute);

// Attorney routes
app.use('/attorney', attorneyRoute);

app.use('/admin', adminRoute);
app.use('/services', servicesRoute);
app.use('/ai', aiAdvisorRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't send JSON if response has already been sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Always send JSON response for API routes
  if (req.path.startsWith('/user') || req.path.startsWith('/admin') || req.path.startsWith('/attorney') || req.path.startsWith('/services')) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } else {
    next(err);
  }
});

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/user') || req.path.startsWith('/admin') || req.path.startsWith('/attorney') || req.path.startsWith('/services')) {
    res.status(404).json({
      message: 'API endpoint not found'
    });
  } else {
    next();
  }
});

dbConnect();

app.listen(port);
