import React from 'react';

export interface YesterdayGuessProps {
    song: {
    name: string;
    artist: string;
    imageUrl: string;
    albumName: string;
    releaseDate: string;
    // ... other fields as needed
    } | null;
}

export const YesterdayGuess: React.FC<YesterdayGuessProps> = ({ song }) => {
    if (!song) return null;
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Yesterday's Song</h3>
        <div className="flex items-center">
          <img src={song.imageUrl} alt={song.name} className="w-16 h-16 rounded-md mr-4" />
          <div>
            <p className="font-medium">{song.name}</p>
            <p className="text-sm text-gray-600">{song.artist}</p>
            <p className="text-xs text-gray-500">{song.albumName} ({song.releaseDate})</p>
          </div>
        </div>
      </div>
    );
};

