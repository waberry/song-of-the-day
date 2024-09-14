import React, { useState, useEffect } from 'react';

interface FlipBoardProps {
  text: string;
  className?: string;
}

export const FlipBoard: React.FC<FlipBoardProps> = ({ text, className = '' }) => {
  const [display, setDisplay] = useState(text);
  const [flipping, setFlipping] = useState<number | null>(null);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

  useEffect(() => {
    const intervalId = setInterval(() => {
      flipAllChars();
    }, 10000); // Trigger a full flip every 10 seconds

    return () => clearInterval(intervalId);
  }, [text]);

  const flipAllChars = () => {
    text.split('').forEach((char, index) => {
      setTimeout(() => flipChar(index), index * 200); // Delay each character's flip
    });
  };

  const flipChar = (index: number) => {
    let currentChar = text[index];
    let flipCount = 0;
    setFlipping(index);
    const flipInterval = setInterval(() => {
      setDisplay(prev => 
        prev.substring(0, index) +
        characters[Math.floor(Math.random() * characters.length)] +
        prev.substring(index + 1)
      );
      flipCount++;
      if (flipCount === 3) { // Reduced number of flips
        clearInterval(flipInterval);
        setDisplay(prev =>
          prev.substring(0, index) + currentChar + prev.substring(index + 1)
        );
        setTimeout(() => setFlipping(null), 500); // Delay resetting flipping state
      }
    }, 150); // Slower flip speed
  };

  return (
    <div className={`inline-flex ${className}`}>
      {display.split('').map((char, index) => (
        <div key={index} className="relative overflow-hidden mx-[1px]" style={{ width: '1em', height: '1.2em' }}>
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              flipping === index ? 'animate-flip' : ''
            }`}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-white rounded shadow-md backface-hidden">
              {char}
            </div>
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-indigo-800 to-sky-400 text-white rounded shadow-md backface-hidden"
              style={{ transform: 'rotateX(180deg)' }}
            >
              {char}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};