import React from 'react';
import { Music, Calendar, Clock, BarChart2, Headphones } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">About Our Song Guessing Game</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">What is this game?</h2>
          <p className="text-gray-700 mb-4">
            Welcome to our unique song guessing game! Each day, we present a mystery song, and your challenge is to guess it correctly. 
            Test your music knowledge and discover new tunes as you play.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">How to Play</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Start by guessing any song you think might be the daily mystery track.</li>
            <li>After each guess, you'll receive hints comparing your choice to the mystery song.</li>
            <li>Use these hints to refine your next guess and get closer to the correct answer.</li>
            <li>Keep guessing until you find the right song or run out of attempts.</li>
            <li>Come back every day for a new mystery song!</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Comparison Hints</h2>
          <p className="text-gray-700 mb-4">
            After each guess, we'll provide you with hints based on these comparisons:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Music className="text-indigo-500 mr-2" size={24} />
              <span>Artist</span>
            </div>
            <div className="flex items-center">
              <Headphones className="text-indigo-500 mr-2" size={24} />
              <span>Album</span>
            </div>
            <div className="flex items-center">
              <Calendar className="text-indigo-500 mr-2" size={24} />
              <span>Release Year</span>
            </div>
            <div className="flex items-center">
              <Music className="text-indigo-500 mr-2" size={24} />
              <span>Genre (in progress) </span>
            </div>
            <div className="flex items-center">
              <Calendar className="text-indigo-500 mr-2" size={24} />
              <span>Decade</span>
            </div>
            <div className="flex items-center">
              <BarChart2 className="text-indigo-500 mr-2" size={24} />
              <span>Popularity</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-indigo-500 mr-2" size={24} />
              <span>Duration</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Tips for Success</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Pay attention to all the hints, not just the artist or title.</li>
            <li>The decade and genre hints can help narrow down your search significantly.</li>
            <li>Don't forget about popularity and duration - they can be surprisingly helpful!</li>
            <li>If you're stuck, try guessing songs from different genres or eras.</li>
            <li>Remember, you can always come back tomorrow for a new challenge!</li>
          </ul>
        </section>
     </div>
    </main>
  );
};

export default AboutPage;