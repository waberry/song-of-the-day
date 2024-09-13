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
      const index = Math.floor(Math.random() * text.length);
      flipChar(index);
    }, 5000); // Trigger a flip every 5 seconds

    return () => clearInterval(intervalId);
  }, [text]);

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
      if (flipCount === 5) {
        clearInterval(flipInterval);
        setDisplay(prev =>
          prev.substring(0, index) + currentChar + prev.substring(index + 1)
        );
        setFlipping(null);
      }
    }, 100);
  };

  return (
    <div className={`inline-flex ${className}`}>
      {display.split('').map((char, index) => (
        <div key={index} className="relative overflow-hidden mx-[1px]">
          <div
            className={`transition-all duration-300 ease-in-out ${
              flipping === index ? 'animate-flip' : ''
            }`}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-white px-2 py-1 rounded shadow-md backface-hidden">
              {char}
            </div>
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-indigo-800 to-sky-400 text-white px-2 py-1 rounded shadow-md backface-hidden"
              style={{ transform: 'rotateX(180deg)' }}
            >
              {char}
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-sky-200 opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-900 opacity-30" />
        </div>
      ))}
    </div>
  );
};


export const AnimatedHeader: React.FC = () => {
  return (
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
      What is the{' '}
      <FlipBoard 
        text="SONG" 
        className="text-emerald-300 inline-block"
      />{' '}
      of the day
    </h1>
  );
};