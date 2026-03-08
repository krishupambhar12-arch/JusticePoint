const mongoose = require('mongoose');
const Attorney = require('./models/Attorney');

mongoose.connect('mongodb://localhost:27017/justice-db').then(async () => {
  try {
    const attorneys = await Attorney.find({ isActive: true }).select('attorneyName specialization experience fees');
    console.log('Available attorneys:', attorneys.length);
    attorneys.forEach(att => {
      console.log(`- ${att.attorneyName} (${att.specialization}) - Exp: ${att.experience}yrs - Fees: $${att.fees}`);
    });
    
    if (attorneys.length === 0) {
      console.log('No attorneys found. Creating a test attorney...');
      const testAttorney = new Attorney({
        attorneyName: 'John Smith',
        attorneyEmail: 'john@law.com',
        attorneyPassword: 'password123',
        specialization: 'Corporate Law',
        experience: 10,
        fees: 200
      });
      await testAttorney.save();
      console.log('Test attorney created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}).catch(err => {
  console.error('Database error:', err);
  process.exit(1);
});
