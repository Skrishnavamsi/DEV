import React, { useState } from 'react';

const tutorialSteps = [
  {
    title: 'Welcome to InterviewAssist',
    content: 'InterviewAssist is your AI-powered companion for online interviews and coding tests. Let\'s get you started!',
  },
  {
    title: 'Choose Your Package',
    content: 'Start with a 5-minute free trial or select our 1-hour package for $25. Your license will be emailed to you upon purchase.',
  },
  {
    title: 'Ask Questions',
    content: 'Type your questions or coding problems in the text area. Our AI will provide real-time assistance and guidance.',
  },
  {
    title: 'One-Click Help',
    content: 'Need a quick tip? Use the "One-Click Help" button for instant interview advice or coding suggestions.',
  },
  {
    title: 'Mobile Compatibility',
    content: 'InterviewAssist works seamlessly on both PC and mobile devices. Practice anytime, anywhere!',
  },
];

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">How to Use InterviewAssist</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{tutorialSteps[currentStep].title}</h3>
        <p>{tutorialSteps[currentStep].content}</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === tutorialSteps.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
