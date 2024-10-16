import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { compare } from 'bcrypt';

// This is a mock database. In a real application, you would use a proper database.
const users = [
  { id: '1', username: 'testuser', email: 'testuser@example.com', password: '$2b$10$9NGW6YR8dkcBtswOAtTsqOHt5y92QwhluKP/YRr3NOVAvgEd9YRKe' }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;
  console.log('Attempting login for username:', username);

  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (session) {
      console.log('User already logged in');
      return res.status(200).json({ message: 'Already logged in', session });
    }

    const user = users.find(u => u.username === username);
    console.log('User found:', user ? 'Yes' : 'No');

    if (user) {
      const isPasswordValid = await compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (isPasswordValid) {
        console.log('Login successful');
        return res.status(200).json({ message: 'Login successful', token: 'mock_token' });
      }
    }

    console.log('Invalid credentials');
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
}
