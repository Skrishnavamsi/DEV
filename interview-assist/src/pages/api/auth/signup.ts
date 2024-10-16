import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { users } from './[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if user already exists
  if (users.some(user => user.email === email || user.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      email,
      password: hashedPassword,
    };

    // Add user to shared users array
    users.push(newUser);

    // Return success response
    return res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
