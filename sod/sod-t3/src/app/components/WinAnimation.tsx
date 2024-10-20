import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const WinAnimation = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });

    const timer = setTimeout(() => setShowAnimation(false), 10000); // Hide after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={500}
      />
      <div className="relative z-10 rounded-lg bg-white bg-opacity-80 px-8 py-4 text-center shadow-lg">
        <h2 className="mb-2 text-4xl font-bold text-emerald-600 animate-bounce">
          Congratulations!
        </h2>
        <p className="text-xl text-gray-800">You've found today's song!</p>
      </div>
    </div>
  );
};

export default WinAnimation;
