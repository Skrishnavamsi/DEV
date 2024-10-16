const axios = require('axios');

async function createTestUser() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/signup', {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    console.log('Test user created:', response.data);
  } catch (error) {
    console.error('Error creating test user:', error.response ? error.response.data : error.message);
  }
}

createTestUser();
