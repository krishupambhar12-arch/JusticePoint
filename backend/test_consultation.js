const mongoose = require('mongoose');
const Attorney = require('./models/Attorney');
const User = require('./models/User');
const Consultation = require('./models/Consultation');

mongoose.connect('mongodb://localhost:27017/justice-db').then(async () => {
  try {
    console.log('🔍 Testing consultation database operations...');
    
    // Check if we have attorneys
    const attorneys = await Attorney.find({ isActive: true });
    console.log(`✅ Found ${attorneys.length} attorneys`);
    
    if (attorneys.length === 0) {
      console.log('❌ No attorneys found. Creating test attorney...');
      const testAttorney = new Attorney({
        attorneyName: 'Test Attorney',
        attorneyEmail: 'test@law.com',
        attorneyPassword: 'password123',
        specialization: 'Criminal Law',
        experience: 5,
        fees: 150
      });
      await testAttorney.save();
      console.log('✅ Test attorney created');
    }
    
    // Check if we have users
    const users = await User.find({ isActive: true });
    console.log(`✅ Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating test user...');
      const testUser = new User({
        name: 'Test Client',
        email: 'client@test.com',
        password: 'password123',
        role: 'Client'
      });
      await testUser.save();
      console.log('✅ Test user created');
    }
    
    // Check existing consultations
    const consultations = await Consultation.find({});
    console.log(`✅ Found ${consultations.length} consultations`);
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  }
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});
