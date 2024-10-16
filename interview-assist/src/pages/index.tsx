import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import PricingTiers from '../components/PricingTiers';
import AIAssistant from '../components/AIAssistant';
import Tutorial from '../components/Tutorial';

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleTierSelect = async (tier: { name: string, price: number, duration: number }) => {
    setSelectedTier(tier.name);
    // Call the purchase API here
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: tier.name === 'Trial' ? 'trial' : 'onehour' }),
      });
      const data = await response.json();
      console.log('Purchase response:', data);
      // Handle the purchase response (e.g., show a success message, update UI)
    } catch (error) {
      console.error('Error purchasing license:', error);
      // Handle the error (e.g., show an error message)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">InterviewAssist</h1>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!session ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to InterviewAssist</h2>
            <p className="mb-4">Please sign in to access the AI assistant and purchase a license.</p>
          </div>
        ) : (
          <>
            {!selectedTier ? (
              <PricingTiers onSelectTier={handleTierSelect} />
            ) : (
              <AIAssistant />
            )}
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
              </button>
            </div>
            {showTutorial && <Tutorial />}
          </>
        )}
      </main>

      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2023 InterviewAssist. All rights reserved.</p>
          <a
            href="https://discord.gg/422Tz962"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Join our Discord for support
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
