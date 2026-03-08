async function testAttorneyAppointments() {
    try {
        // Test 1: Login as Krupa
        console.log('🔍 Testing Krupa login...');
        const loginResponse = await fetch('http://localhost:5000/attorney/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'krupa@gmail.com',
                password: '123456'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('✅ Krupa login result:', loginData.message);
        
        if (loginData.token) {
            // Test 2: Get Krupa's appointments
            console.log('\n🔍 Getting Krupa appointments...');
            const apptResponse = await fetch('http://localhost:5000/attorney/appointments', {
                headers: { 
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const apptData = await apptResponse.json();
            console.log('✅ Krupa appointments count:', apptData.appointments?.length || 0);
            console.log('📋 Krupa appointments:');
            apptData.appointments?.forEach((apt, index) => {
                console.log(`  ${index + 1}. ${apt.subject} - ${apt.date} - ${apt.clientName || apt.patient?.name}`);
            });
        }
        
        // Test 3: Login as krishna
        console.log('\n🔍 Testing krishna login...');
        const krishnaLogin = await fetch('http://localhost:5000/attorney/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'krishupambhar@gmail.com', 
                password: '123456'
            })
        });
        
        const krishnaData = await krishnaLogin.json();
        console.log('✅ krishna login result:', krishnaData.message);
        
        if (krishnaData.token) {
            // Test 4: Get krishna appointments
            console.log('\n🔍 Getting krishna appointments...');
            const krishnaApptResponse = await fetch('http://localhost:5000/attorney/appointments', {
                headers: { 
                    'Authorization': `Bearer ${krishnaData.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const krishnaApptData = await krishnaApptResponse.json();
            console.log('✅ krishna appointments count:', krishnaApptData.appointments?.length || 0);
            console.log('📋 krishna appointments:');
            krishnaApptData.appointments?.forEach((apt, index) => {
                console.log(`  ${index + 1}. ${apt.subject} - ${apt.date} - ${apt.clientName || apt.patient?.name}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAttorneyAppointments();
