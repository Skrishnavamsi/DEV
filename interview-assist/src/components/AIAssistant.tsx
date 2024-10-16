import React, { useState } from 'react';

interface AIAssistantProps {
  // Add any props if needed
}

const AIAssistant: React.FC<AIAssistantProps> = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getAIResponse(userInput);
  };

  const handleOneClickHelp = async () => {
    const helpPrompt = "Give me a quick tip for succeeding in a job interview.";
    await getAIResponse(helpPrompt);
  };

  const getAIResponse = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('An error occurred while fetching the AI response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">InterviewAssist AI</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded-md mb-2"
          rows={4}
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask your question here..."
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get AI Assistance'}
          </button>
          <button
            type="button"
            onClick={handleOneClickHelp}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            disabled={isLoading}
          >
            One-Click Help
          </button>
        </div>
      </form>
      {aiResponse && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">AI Response:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
