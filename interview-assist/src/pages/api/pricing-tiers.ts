import { NextApiRequest, NextApiResponse } from 'next';

const pricingTiers = [
  { id: '1', name: 'Trial', duration: 5, price: 0 },
  { id: '2', name: 'Standard', duration: 60, price: 25 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  res.status(200).json(pricingTiers);
}
