// Script to reset earnings by updating appointment fees
// Run this in your backend directory with: node reset_earnings.js

const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

// Connect to MongoDB (update connection string as needed)
mongoose.connect('mongodb://localhost:27017/justice_point', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to database');
  
  // Option 1: Set all completed appointments to 1000 fees (4 appointments = 4000)
  await Appointment.updateMany(
    { status: 'Completed' },
    { $set: { attorneyFees: 1000 } }
  );
  console.log('✅ Updated all completed appointments to 1000 fees');
  
  // Option 2: OR change some completed to pending (to reduce count)
  // Uncomment below to change extra completed appointments to Pending
  /*
  const completedAppointments = await Appointment.find({ status: 'Completed' });
  if (completedAppointments.length > 4) {
    // Keep first 4 as completed, change rest to pending
    for (let i = 4; i < completedAppointments.length; i++) {
      await Appointment.findByIdAndUpdate(
        completedAppointments[i]._id,
        { $set: { status: 'Pending' } }
      );
    }
    console.log(`Changed ${completedAppointments.length - 4} appointments to Pending`);
  }
  */
  
  // Verify current earnings calculation
  const completed = await Appointment.find({ status: 'Completed' });
  const totalEarnings = completed.reduce((sum, apt) => sum + (apt.attorneyFees || 0), 0);
  console.log(`\n📊 Current Stats:`);
  console.log(`- Completed appointments: ${completed.length}`);
  console.log(`- Total earnings: ₹${totalEarnings}`);
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
