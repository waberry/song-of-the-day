import React, { useState, useRef, useEffect } from 'react';
import { getDetailedSongComparison, ComparisonKey } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import { trackType as Song } from "~/types/spotify.types";
import { Check, X, Music, Disc, Calendar, Clock, BarChart2, Tag, ChevronRight } from 'lucide-react';

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> = ({ gameState, dailySong }) => {
  if (!gameState || !dailySong) {
    return null;
  }

  const [slideStates, setSlideStates] = useState<{ [key: string]: boolean }>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});
  const getComparisonIcon = (result: boolean) => {
    return result ? (
      <Check className="text-green-500" size={20} />
    ) : (
      <X className="text-red-500" size={20} />
    );
  };

  const getComparison = (key: ComparisonKey) => {
    switch (key) {
      case ComparisonKey.Artist: return <Music size={20} />;
      case ComparisonKey.Album: return <Disc size={20} />;
      case ComparisonKey.Year: return <Calendar size={20} />;
      case ComparisonKey.Genre: return <Tag size={20} />;
      case ComparisonKey.Popularity: return <BarChart2 size={20} />;
      case ComparisonKey.Duration: return <Clock size={20} />;
      default: return null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = (songId: string) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe || isRightSwipe) {
      setSlideStates(prev => ({ ...prev, [songId]: isLeftSwipe }));
    }
  };
  return (
    <div className="container w-full mx-auto">      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700 text-xs">
              <th className="p-2 text-left">Song</th>
              <th className="p-2 text-left hidden sm:table-cell">Artist</th>
              <th className="p-2 text-left hidden sm:table-cell">Hints</th>
            </tr>
          </thead>
          <tbody>
            {gameState.pickedSongs.map( (song, index) => {
              const detailedComparison = getDetailedSongComparison(song, dailySong);
              const isSlided = slideStates[song.id] || false;

              return (
                <tr 
                  key={song.id} 
                  ref={el => rowRefs.current[song.id] = el}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} relative`}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(song.id)}
                >
                  <td className="p-2 sm:w-1/4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={song.album.images[0]?.url}
                        alt={`${song.name} cover`}
                        className="w-10 h-10 object-cover rounded-sm shadow"
                      />
                      <span className="font-medium text-sm truncate">{song.name}</span>
                    </div>
                  </td>
                  <td className="p-2 hidden sm:table-cell sm:w-1/4">
                    <span className="text-sm truncate">{song.artists[0]?.name}</span>
                  </td>
                  <td className="p-2 hidden sm:table-cell sm:w-1/2">
                    <div className="grid grid-cols-3 gap-1">
                      {Object.entries(detailedComparison).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-1 text-xs">
                          {getComparisonIcon(value.result)}
                          {getComparison(key as ComparisonKey)}
                          <span className="truncate" title={value.message}>
                            {value.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td 
                    className={`absolute top-0 right-0 h-full bg-gray-100 transition-transform duration-300 ease-in-out transform sm:hidden ${
                      isSlided ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ width: 'calc(100% - 40px)' }}
                  >
                    <div className="p-2 h-full overflow-y-auto">
                      <div className="grid grid-cols-1 gap-1">
                        {Object.entries(detailedComparison).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-1 text-xs">
                            {getComparisonIcon(value.result)}
                            {getComparison(key as ComparisonKey)}
                            <span className="truncate" title={value.message}>
                              {value.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <div 
                    className={`absolute top-0 right-0 h-full flex items-center justify-center bg-indigo-100 text-indigo-500 sm:hidden ${
                      isSlided ? 'hidden' : 'w-10'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </div>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongComparisonTable;