const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: 'user',
      password: 'password',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    console.log('Login response:', response.data);
    console.log('Set-Cookie header:', response.headers['set-cookie']);
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
}

testLogin();
