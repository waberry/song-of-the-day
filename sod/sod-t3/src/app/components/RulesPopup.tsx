import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

const RulesPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-white rounded-full p-2 shadow-md"
        aria-label="Game Rules"
      >
        <Info size={24} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">How to Play</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <ul className="list-disc list-inside space-y-2">
              <li>Guess the song of the day in as few attempts as possible.</li>
              <li>Each guess must be a valid song from our database.</li>
              <li>After each guess, you'll see how close your guess was to the target song.</li>
              <li>The game resets daily with a new song to guess.</li>
              <li>Share your results without spoiling the answer for others!</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesPopup;