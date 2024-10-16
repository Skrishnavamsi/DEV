import { NextApiRequest, NextApiResponse } from 'next';

const pricingTiers = [
  { id: '1', name: 'Trial', duration: 5, price: 0 },
  { id: '2', name: 'Standard', duration: 60, price: 25 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tierId } = req.body;

  if (!tierId) {
    return res.status(400).json({ message: 'Missing tierId' });
  }

  const selectedTier = pricingTiers.find(tier => tier.id === tierId);

  if (!selectedTier) {
    return res.status(404).json({ message: 'Tier not found' });
  }

  // Here you would typically save the selected tier to the user's session or database
  // For this example, we'll just return the selected tier

  res.status(200).json({ message: 'Tier selected successfully', tier: selectedTier });
}
