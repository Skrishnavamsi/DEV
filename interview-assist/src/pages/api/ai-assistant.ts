import { NextApiRequest, NextApiResponse } from 'next';
import { generateAIResponse } from '../../utils/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'Invalid prompt' });
  }

  try {
    const response = await generateAIResponse(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
