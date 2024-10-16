const axios = require('axios');

async function login(username, password) {
  console.log('Attempting to login with username:', username);
  try {
    console.log('Sending login request to:', 'http://localhost:3000/api/login');
    const response = await axios.post('http://localhost:3000/api/login', {
      username,
      password
    });
    console.log('Login response:', response.data);
    return response.data.token; // Assuming the login API returns a token
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    console.error('Full error object:', error);
    return null;
  }
}

async function testLicenseManagement() {
  try {
    console.log('Starting license management test');
    // Login first
    const token = await login('testuser', 'testpassword');
    if (!token) {
      console.error('Failed to login. Cannot proceed with license purchase test.');
      return;
    }
    console.log('Login successful, received token:', token);

    // Test purchasing a license
    console.log('Attempting to purchase a license');
    const purchaseResponse = await axios.post('http://localhost:3000/api/purchase', {
      tierId: '2',
      email: 'test@example.com'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Purchase response:', purchaseResponse.data);

    // Check if the purchase was successful
    if (purchaseResponse.data.message === 'License purchased successfully') {
      console.log('License purchased successfully');
      console.log('Please check the email inbox for test@example.com for the license details');
    } else {
      console.log('License purchase failed');
    }
  } catch (error) {
    console.error('License management test error:', error.response ? error.response.data : error.message);
    console.error('Full error object:', error);
  }
}

console.log('Starting test script');
testLicenseManagement();
