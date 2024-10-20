import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GenreDisplayProps {
  genres: string[];
}

const GenreDisplay: React.FC<GenreDisplayProps> = ({ genres }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderGenreBadges = (genresToRender: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {genresToRender.map((genre, index) => (
          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            {genre}
          </span>
        ))}
      </div>
    );
  };

  const renderGenreModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Genres</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          {renderGenreBadges(genres)}
        </div>
      </div>
    );
  };

  const displayedGenres = genres.slice(0, 2);
  const remainingCount = genres.length - displayedGenres.length;

  return (
    <>
      <div className="flex flex-col items-center">
        {renderGenreBadges(displayedGenres)}
        {remainingCount > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-1 text-xs text-indigo-600 hover:text-indigo-800"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
      {isModalOpen && renderGenreModal()}
    </>
  );
};

export default GenreDisplay;