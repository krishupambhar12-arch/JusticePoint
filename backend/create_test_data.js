const mongoose = require('mongoose');
const Attorney = require('./models/Attorney');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/justice-db').then(async () => {
  try {
    console.log('🔍 Creating test data for consultation system...');
    
    // Create test attorneys if none exist
    const existingAttorneys = await Attorney.find({ isActive: true });
    if (existingAttorneys.length === 0) {
      console.log('📝 Creating test attorneys...');
      
      const attorneys = [
        {
          attorneyName: 'Rajesh Kumar',
          attorneyEmail: 'rajesh@law.com',
          attorneyPassword: 'password123',
          specialization: 'Criminal Law',
          experience: 8,
          fees: 500
        },
        {
          attorneyName: 'Priya Sharma',
          attorneyEmail: 'priya@law.com',
          attorneyPassword: 'password123',
          specialization: 'Family Law',
          experience: 5,
          fees: 300
        },
        {
          attorneyName: 'Amit Verma',
          attorneyEmail: 'amit@law.com',
          attorneyPassword: 'password123',
          specialization: 'Corporate Law',
          experience: 12,
          fees: 800
        }
      ];
      
      for (const att of attorneys) {
        const attorney = new Attorney(att);
        await attorney.save();
        console.log(`✅ Created attorney: ${att.attorneyName}`);
      }
    }
    
    // Create test users if none exist
    const existingUsers = await User.find({ isActive: true, role: 'Client' });
    if (existingUsers.length === 0) {
      console.log('📝 Creating test users...');
      
      const users = [
        {
          name: 'Test Client 1',
          email: 'client1@test.com',
          password: 'password123',
          role: 'Client'
        },
        {
          name: 'Test Client 2',
          email: 'client2@test.com',
          password: 'password123',
          role: 'Client'
        }
      ];
      
      for (const user of users) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`✅ Created user: ${user.name}`);
      }
    }
    
    console.log('🎉 Test data creation completed!');
    console.log('\n📋 Login Credentials:');
    console.log('Clients:');
    console.log('  Email: client1@test.com, Password: password123');
    console.log('  Email: client2@test.com, Password: password123');
    console.log('\nAttorneys:');
    console.log('  Email: rajesh@law.com, Password: password123');
    console.log('  Email: priya@law.com, Password: password123');
    console.log('  Email: amit@law.com, Password: password123');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});
