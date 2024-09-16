import React, { useState, useMemo } from 'react';
import { ComparisonKey, ComparisonResult } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import {
  Flag, Disc, Calendar, Clock, BarChart2, 
  Tag, Music, CheckCircle2, Check,
  ArrowUp, ArrowDown, Minus, TrendingUp,
  ChevronDown, ChevronUp, PersonStanding
} from 'lucide-react';
import { Track as Song } from '@prisma/client';

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> = ({ gameState, dailySong }) => {
  const [expandedGenres, setExpandedGenres] = useState<Record<string, boolean>>({});

  if (!gameState || !dailySong) return null;

  const comparisonKeys = Object.values(ComparisonKey);

  const commonAttributes = useMemo(() => {
    if (gameState.pickedSongs.length === 0) return {};
   
    return comparisonKeys.reduce((acc, key) => {
      const correctValues = gameState.pickedSongs
        .map(song => song.comparison[key])
        .filter(value => value.result)
        .map(value => value.selectedValue);

      if (correctValues.length > 0 && new Set(correctValues).size === 1) {
        acc[key] = correctValues[0].toString();
      }
      return acc;
    }, {} as Partial<Record<ComparisonKey, string>>);
  }, [gameState]);

  const getComparisonIcon = (key: ComparisonKey) => {
    const icons: Record<ComparisonKey, React.ReactNode> = {
      [ComparisonKey.Artist]: <PersonStanding size={16} />,
      [ComparisonKey.Album]: <Disc size={16} />,
      [ComparisonKey.Year]: <Calendar size={16} />,
      [ComparisonKey.Decade]: <TrendingUp size={16} />,
      [ComparisonKey.Genre]: <Tag size={16} />,
      [ComparisonKey.Popularity]: <BarChart2 size={16} />,
      [ComparisonKey.Duration]: <Clock size={16} />,
      [ComparisonKey.ArtistCountry]: <Flag size={16} />,
    };
    return icons[key] || null;
  };

  const getComparisonResult = (key: ComparisonKey, value: ComparisonResult[ComparisonKey]) => {
    if (value.result) {
      return <Check className="text-green-500" size={16} />;
    }
    const comparisonIcons = {
      higher: <ArrowUp className="text-red-500" size={16} />,
      lower: <ArrowDown className="text-red-500" size={16} />,
    };
    if ([ComparisonKey.Year, ComparisonKey.Decade, ComparisonKey.Popularity, ComparisonKey.Duration].includes(key)) {
      return comparisonIcons[value.comparison as keyof typeof comparisonIcons] || <Minus className="text-red-500" size={16} />;
    }
    return <Minus className="text-red-500" size={12} />;
  };

  return (
    <div className="container mx-auto mb-4">
      <div className="bg-white rounded-xl shadow-md p-3">
        <MysteryRow comparisonKeys={comparisonKeys} commonAttributes={commonAttributes} getComparisonIcon={getComparisonIcon} />
        {gameState.pickedSongs.map((song, index) => (
          <SongRow 
            key={song.id} 
            song={song} 
            comparisonKeys={comparisonKeys} 
            getComparisonIcon={getComparisonIcon}
            getComparisonResult={getComparisonResult}
            expandedGenres={expandedGenres}
            setExpandedGenres={setExpandedGenres}
          />
        ))}
      </div>
    </div>
  );
};

const MysteryRow: React.FC<{ 
  comparisonKeys: ComparisonKey[],
  commonAttributes: Partial<Record<ComparisonKey, string>>,
  getComparisonIcon: (key: ComparisonKey) => React.ReactNode,
  dailySong: Song,
  isFound: boolean
}> = ({ comparisonKeys, commonAttributes, getComparisonIcon, dailySong, isFound }) => (
  <div className="mb-3 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg">
    {isFound ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Today's Song Revealed!</h3>
        <div className="flex items-center">
          <img 
            src={dailySong.album.images[0]?.url} 
            alt={dailySong.name} 
            className="w-16 h-16 rounded-md mr-4"
          />
          <div>
            <p className="font-medium">{dailySong.name}</p>
            <p className="text-sm">{dailySong.artists.map(a => a.name).join(', ')}</p>
            <p className="text-xs">{dailySong.album.name} ({new Date(dailySong.album.release_date).getFullYear()})</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {comparisonKeys.map((key) => (
            <div key={key} className="flex items-center">
              {getComparisonIcon(key)}
              <span className="ml-1 mr-1 font-bold">{key}:</span>
              <span className="ml-auto">
                {key === ComparisonKey.Genre 
                  ? dailySong.genres.join(', ')
                  : dailySong[key.toLowerCase()] || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div>
        <div className="flex items-center mb-2">
          <Music size={18} className="mr-2" />
          <span className="font-semibold text-base">Mystery Song</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {comparisonKeys.map((key) => (
            <div key={key} className="flex items-center">
              {getComparisonIcon(key)}
              <span className="ml-1 mr-1 font-bold">{key}:</span>
              <span className="ml-auto">{commonAttributes[key] || 'Hidden'}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const SongRow: React.FC<{ 
  song: Song & { comparison: ComparisonResult }, 
  comparisonKeys: ComparisonKey[],
  getComparisonIcon: (key: ComparisonKey) => React.ReactNode,
  getComparisonResult: (key: ComparisonKey, value: ComparisonResult[ComparisonKey]) => React.ReactNode,
  expandedGenres: Record<string, boolean>,
  setExpandedGenres: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}> = ({ song, comparisonKeys, getComparisonIcon, getComparisonResult, expandedGenres, setExpandedGenres }) => (
  <div className="mb-3 p-3 bg-gray-100 rounded-lg">
    <div className="flex items-center mb-2">
      <img
        src={song.album.images[0]?.url}
        alt={`${song.name} cover`}
        className="w-10 h-10 object-cover rounded-md shadow-sm mr-2"
      />
      <span className="font-medium text-sm truncate">{song.name}</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
      {comparisonKeys.map((key) => (
        <div key={key} className="flex items-center">
          {getComparisonIcon(key)}
          <span className="ml-1 mr-1 font-bold">{key}:</span>
          <div className="ml-auto flex items-center">
            {getComparisonResult(key, song.comparison[key])}
            <span className="ml-1">
              {key === ComparisonKey.Genre ? (
                <GenreDisplay 
                  genres={song.comparison[key].selectedValue as string} 
                  songId={song.id}
                  expandedGenres={expandedGenres}
                  setExpandedGenres={setExpandedGenres}
                />
              ) : (
                song.comparison[key].selectedValue
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GenreDisplay: React.FC<{ 
  genres: string, 
  songId: string, 
  expandedGenres: Record<string, boolean>, 
  setExpandedGenres: React.Dispatch<React.SetStateAction<Record<string, boolean>>> 
}> = ({ genres, songId, expandedGenres, setExpandedGenres }) => {
  const genresList = genres.split(',');
  const isExpanded = expandedGenres[songId];
  const displayGenres = isExpanded ? genresList : [genresList[0]];

  return (
    <div className="flex flex-wrap items-center">
      {displayGenres.map((genre, index) => (
        <span key={index} className="mr-1 px-1 bg-indigo-100 text-indigo-800 rounded">
          {genre}
        </span>
      ))}
      {genresList.length > 1 && (
        <button
          onClick={() => setExpandedGenres(prev => ({ ...prev, [songId]: !prev[songId] }))}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      )}
    </div>
  );
};

export default SongComparisonTable;