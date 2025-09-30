// Test file to check backend connectivity
// Run this in browser console or create a simple test page

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch('http://localhost:9050/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.text();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Backend is accessible');
    } else {
      console.log('❌ Backend returned error');
    }
    
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error);
    console.log('Make sure your backend is running on http://localhost:9050');
  }
}

// Uncomment to run the test
// testBackendConnection();

export default testBackendConnection;