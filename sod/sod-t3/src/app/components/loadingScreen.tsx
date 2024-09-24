"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faMicrophone, faHeadphones, faGuitar } from "@fortawesome/free-solid-svg-icons";

const musicTips = [
  "Get ready to test your music knowledge!",
  "Can you guess today's song?",
  "Listen carefully to the clues...",
  "Every day, a new song challenge awaits!",
  "Sharpen your ears for the melody!",
];

const LoadingScreen: React.FC = () => {
  const [tip, setTip] = useState(musicTips[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTip(musicTips[Math.floor(Math.random() * musicTips.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black">
      
      <p className="mt-8 text-2xl font-bold text-white">
        Loading Your Session...
      </p>
      <p className="mt-4 text-lg text-gray-300 animate-pulse">
        {tip}
      </p>
      <div className="mt-8 flex space-x-4">
        <FontAwesomeIcon icon={faMusic} className="text-3xl text-purple-400 animate-bounce" />
        <FontAwesomeIcon icon={faMicrophone} className="text-3xl text-pink-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
        <FontAwesomeIcon icon={faHeadphones} className="text-3xl text-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
        <FontAwesomeIcon icon={faGuitar} className="text-3xl text-green-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
};

export default LoadingScreen;