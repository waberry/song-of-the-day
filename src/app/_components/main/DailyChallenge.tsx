import React from 'react';
import { GameState } from "src/types/types";
import { FlipBoard } from './AnimatedText';
import ShareButton from './ShareOnTwitter';

interface EnhancedGameHeaderProps {
  gameState: GameState | null;
}

const EnhancedGameHeader: React.FC<EnhancedGameHeaderProps> = ({ gameState }) => {
  return (
    <header className="text-center py-8 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 flex items-center justify-center flex-wrap">
        <span>What is the </span>
        <FlipBoard 
          text="SONG" 
          className="text-emerald-300 inline-block mx-2"
        />
        <span>of the day?</span>
      </h1>
      
      <div className="mt-6">
        {gameState?.dailySongFound ? (
          <div className="animate-bounce">
            <h2 className="text-2xl font-bold text-emerald-300">
              Congratulations!
            </h2>
            <p className="text-xl">You've found today's song!</p>
          </div>
        ) : (
          <>
            <p className="text-xl">
              The song of the day is hidden. Can you guess it?
            </p>
            <p className="text-lg mt-2">
              Attempts: <span className="font-bold text-emerald-300">{gameState?.pickedSongs.length || 0}</span>
            </p>
          </>
        )}
      </div>
      
      <div className="mt-8 flex flex-col items-center justify-center">
        <p className="text-sm opacity-75 mb-2">
          {gameState?.dailySongFound 
            ? "Share your achievement!" 
            : "Use the search box below to make your guess!"}
        </p>
        {gameState && <ShareButton gameState={gameState} />}
      </div>
    </header>
    
  );
};

export default EnhancedGameHeader;