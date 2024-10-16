const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/signup', {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Signup response:', response.data);
  } catch (error) {
    console.error('Signup error:', error.response ? error.response.data : error.message);
  }
}

testSignup();
