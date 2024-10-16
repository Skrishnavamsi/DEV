const axios = require('axios');

async function testAuthFlow() {
  console.log('Starting authentication flow test');

  // Test sign-up
  try {
    console.log('Testing sign-up...');
    const signupResponse = await axios.post('http://localhost:3000/api/auth/signup', {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    console.log('Sign-up response:', signupResponse.data);
  } catch (error) {
    console.error('Sign-up error:', error.response ? error.response.data : error.message);
  }

  // Test login
  try {
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/callback/credentials', {
      username: 'testuser',
      password: 'testpassword',
      callbackUrl: 'http://localhost:3000'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log('Login response:', loginResponse.data);

    // Extract the session cookie
    const cookies = loginResponse.headers['set-cookie'];
    const sessionCookie = cookies.find(cookie => cookie.startsWith('next-auth.session-token='));

    if (sessionCookie) {
      console.log('Testing protected route access...');
      const protectedResponse = await axios.get('http://localhost:3000/api/protected', {
        headers: {
          Cookie: sessionCookie
        },
        withCredentials: true
      });
      console.log('Protected route response:', protectedResponse.data);
    } else {
      console.error('No session cookie found after login');
    }
  } catch (error) {
    console.error('Login or protected route error:', error.response ? error.response.data : error.message);
  }
}

testAuthFlow();
