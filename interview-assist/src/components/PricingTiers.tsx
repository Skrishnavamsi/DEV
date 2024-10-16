import React, { useState } from 'react';

interface PricingTier {
  name: string;
  price: number;
  duration: number;
  description: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Trial',
    price: 0,
    duration: 5,
    description: '5-minute free trial',
  },
  {
    name: 'Standard',
    price: 25,
    duration: 60,
    description: '1-hour package',
  },
];

interface PricingTiersProps {
  onSelectTier: (tier: PricingTier) => void;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleSelectTier = (tier: PricingTier) => {
    setSelectedTier(tier);
    onSelectTier(tier);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Choose Your Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`border rounded-lg p-4 ${
              selectedTier === tier ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
            <p className="text-2xl font-bold mb-2">
              ${tier.price}
              <span className="text-sm font-normal"> / {tier.duration} minutes</span>
            </p>
            <p className="mb-4">{tier.description}</p>
            <button
              onClick={() => handleSelectTier(tier)}
              className={`w-full py-2 rounded-md ${
                selectedTier === tier
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {selectedTier === tier ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingTiers;
