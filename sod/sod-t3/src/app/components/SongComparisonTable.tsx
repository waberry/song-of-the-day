import React, { useState, useEffect, useMemo } from 'react';

import { getDetailedSongComparison, ComparisonKey, ComparisonResult, truncateGenres } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import { Flag, Disc, Calendar, Clock, BarChart2, Tag, Globe, Music, CheckCircle2, Check, ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
import { Track as Song } from '@prisma/client';
import { api } from '~/trpc/react';
import { getArtistsInfo } from '../actions/gameActions';

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> =  ({ gameState, dailySong }) => {
  const [comparisons, setComparisons] = useState<Record<string, ComparisonResult>>({});
  const [dailySongArtists, setDailySongArtists] = useState({});

  useEffect(() => {
    const moreInfo = async () => {
      if (!dailySong) return;
      let ids = dailySong.artists.flatMap((artist) => artist.artistId);
      let artists = await getArtistsInfo(ids);
      setDailySongArtists(artists);
    }
    moreInfo();
  }, []);
  
  useEffect(() => {
    
    const fetchComparisons = async () => {
      if (!gameState || !dailySong) return;

      const newComparisons: Record<string, ComparisonResult> = {};
      console.log("Comparisons -> \n", newComparisons);
      
      
      for (const song of gameState.pickedSongs) {
        const artistIds = [
          ...new Set(
            song.artists.flatMap((artist) => artist.id)
          ),
        ];
        let selectedSongArtists = await getArtistsInfo(artistIds.join(","));
        newComparisons[song.id] = await getDetailedSongComparison(song, dailySong, selectedSongArtists, dailySongArtists); 
      }
      setComparisons(newComparisons);
    };

    fetchComparisons();
  }, [gameState, dailySong]);

  const commonAttributes = useMemo(() => {
    const newCommonAttributes: Partial<Record<ComparisonKey, string>> = {};
    if (Object.keys(comparisons).length > 0) {
      Object.values(ComparisonKey).forEach(key => {
        const allValues = Object.values(comparisons).map(comparison => comparison[key]);
        const correctValues = allValues.filter(value => value.result).map(value => value.selectedValue);
        if (correctValues.length > 0 && new Set(correctValues).size === 1) {
          newCommonAttributes[key] = correctValues[0].toString();
        }
      });
    }
    return newCommonAttributes;
  }, [comparisons]);

  if (!gameState || !dailySong) {
    return null;
  }

  const getComparisonIcon = (key: ComparisonKey) => {
    const icons = {
      [ComparisonKey.Artist]: <Globe size={20} />,
      [ComparisonKey.Album]: <Disc size={20} />,
      [ComparisonKey.Year]: <Calendar size={20} />,
      [ComparisonKey.Decade]: <TrendingUp size={20} />,
      [ComparisonKey.Genre]: <Tag size={20} />,
      [ComparisonKey.Popularity]: <BarChart2 size={20} />,
      [ComparisonKey.Duration]: <Clock size={20} />,
      [ComparisonKey.ArtistCountry]: <Flag size={20} />,
    };
    return icons[key] || null;
  };

  const getComparisonResult = (key: ComparisonKey, value: any) => {
    if (value.result) {
      return <Check className="text-green-500" size={20} />;
    }
    const comparisonIcons = {
      higher: <ArrowUp className="text-red-500" size={20} />,
      lower: <ArrowDown className="text-red-500" size={20} />,
    };
    if (key === ComparisonKey.Year || key === ComparisonKey.Decade || key === ComparisonKey.Popularity || key === ComparisonKey.Duration) {
      return comparisonIcons[value.comparison] || <Minus className="text-red-500" size={20} />;
    }
    return <Minus className="text-red-500" size={20} />;
  };

  return (
    <div className="container w-full mx-auto overflow-hidden">
      <div className="rounded-xl shadow-md bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm sticky top-0 z-10">
                <th className="p-4 text-left font-semibold rounded-tl-xl">
                  <div className="flex items-center space-x-2">
                    <Music size={24} />
                    <span>Mystery Song</span>
                  </div>
                </th>
                {Object.values(ComparisonKey).map((key, index) => (
                  <th key={key} className={`p-4 text-center font-semibold ${index === Object.values(ComparisonKey).length - 1 ? 'rounded-tr-xl' : ''}`}>
                    <div className="flex flex-col items-center justify-center">
                      {getComparisonIcon(key)}
                      <span className="mt-1">{key}</span>
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-base sticky top-14 z-10 shadow-lg">
                <td className="p-3 text-left font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={20} />
                    <span>Common Attributes</span>
                  </div>
                </td>
                {Object.values(ComparisonKey).map((key) => (
                  <td key={key} className="p-3 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {commonAttributes[key] ? (
                        <span className="text-sm font-medium">{commonAttributes[key]}</span>
                      ) : (
                        <span className="text-sm font-medium">-</span>
                      )}
                      <span className="text-xs mt-1">{commonAttributes[key] ? 'Match' : 'No Match'}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gameState.pickedSongs.map((song, index) => {
                const detailedComparison = comparisons[song.id];
                const isLastRow = index === gameState.pickedSongs.length - 1;
                
                if (!detailedComparison) return null; // Skip if comparison is not loaded yet

                return (
                  <tr key={song.id} className={`transition-colors duration-150 ease-in-out hover:bg-gray-50`}>
                    <td className={`p-3 ${isLastRow ? 'rounded-bl-xl' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src={song.album.images[0]?.url}
                          alt={`${song.name} cover`}
                          className="w-12 h-12 object-cover rounded-md shadow-sm"
                        />
                        <span className="font-medium text-sm truncate">{song.name}</span>
                      </div>
                    </td>
                    {Object.entries(detailedComparison).map(([key, value], colIndex) => (
                      <td 
                        key={key} 
                        className={`p-3 text-center ${isLastRow && colIndex === Object.entries(detailedComparison).length - 1 ? 'rounded-br-xl' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          {getComparisonResult(key as ComparisonKey, value)}
                          {key === ComparisonKey.Genre ? (
                            <div className="relative group">
                              <span className="text-sm truncate mt-1">
                                {truncateGenres(value.selectedValue as string)}
                              </span>
                              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 mt-2 whitespace-nowrap">
                                {value.selectedValue}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm truncate mt-1" title={value.message}>
                              {value.selectedValue}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SongComparisonTable;
