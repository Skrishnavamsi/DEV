import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const InterviewAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(prevTime => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingTime <= 0) {
      setResponse('Your session has expired. Please purchase more time.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while getting the AI response.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const handlePurchase = async (type: 'trial' | 'onehour') => {
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) {
        throw new Error('Failed to purchase');
      }

      const data = await res.json();
      setRemainingTime(data.remainingTime);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to purchase. Please try again.');
    }
  };

  const [showTutorial, setShowTutorial] = useState(false);

  const Tutorial = () => (
    <div className="bg-yellow-100 p-4 rounded mb-4">
      <h2 className="font-bold mb-2">How to use InterviewAssist:</h2>
      <ol className="list-decimal list-inside">
        <li>Purchase a trial or 1-hour package.</li>
        <li>Enter your interview question or topic in the text area.</li>
        <li>Click "Get AI Assistance" to receive real-time help.</li>
        <li>Review the AI-generated response to improve your interview skills.</li>
      </ol>
      <button
        onClick={() => setShowTutorial(false)}
        className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Close Tutorial
      </button>
    </div>
  );

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">InterviewAssist</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <span className="mr-0 sm:mr-4 mb-2 sm:mb-0">Welcome, {session.user?.name}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <button
        onClick={() => setShowTutorial(true)}
        className="mb-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Learn how to use
      </button>

      {showTutorial && <Tutorial />}

      {session ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <p className="w-full text-lg">Remaining time: {remainingTime} seconds</p>
            <button
              onClick={() => handlePurchase('trial')}
              className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Get 5-minute Trial
            </button>
            <button
              onClick={() => handlePurchase('onehour')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Purchase 1-hour Package ($25)
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg resize-y"
              rows={4}
              placeholder="Enter your interview question or topic here"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading || remainingTime <= 0}
              >
                {loading ? 'Processing...' : 'Get AI Assistance'}
              </button>
            </div>
          </form>
          {response && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="font-bold text-xl mb-3">AI Response:</h2>
              <p className="text-lg">{response}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-lg">Please sign in to use InterviewAssist.</p>
      )}
    </div>
  );
};

export default InterviewAssistant;
