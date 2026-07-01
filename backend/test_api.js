// Test API endpoints without database

async function testAPI() {
  console.log('🔍 Testing consultation API endpoints...');
  
  try {
    // Test attorneys endpoint
    console.log('\n1. Testing /consultation/attorneys endpoint...');
    // NOTE: this test script needs a real JWT.
    // Set TEST_TOKEN in environment before running.
    const TEST_TOKEN = process.env.TEST_TOKEN || '';

    if (!TEST_TOKEN) {
      console.log('\n⚠️  TEST_TOKEN not set. Skipping token-based endpoints.');
      return;
    }



    const attorneysRes = await fetch('http://localhost:5000/consultation/attorneys', {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const attorneysData = await attorneysRes.json();
    console.log('Status:', attorneysRes.status);
    console.log('Response:', attorneysData);
    
    // Test consultations endpoint
    console.log('\n2. Testing /consultation/my-consultations endpoint...');
    const consultationsRes = await fetch('http://localhost:5000/consultation/my-consultations', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    const consultationsData = await consultationsRes.json();
    console.log('Status:', consultationsRes.status);
    console.log('Response:', consultationsData);
    
    console.log('\n✅ API endpoints are accessible!');
    
  } catch (error) {
    console.error('❌ API test error:', error);
  }
}

testAPI();
