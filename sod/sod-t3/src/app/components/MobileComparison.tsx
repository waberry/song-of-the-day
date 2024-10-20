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
  }, [gameState.pickedSongs]);

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
    return <Minus className="text-red-500" size={8} />;
  };

  const renderComparisonValue = (key: ComparisonKey, value: ComparisonResult[ComparisonKey], songId: string) => {
    if (key === ComparisonKey.Genre) {
      return <GenreDisplay genres={value.selectedValue as string} songId={songId} expandedGenres={expandedGenres} setExpandedGenres={setExpandedGenres} />;
    }
    return (
      <span className="text-xs truncate" title={value.message}>
        {value.selectedValue}
      </span>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Mystery Song</h2>
        <div className="grid grid-cols-2 gap-2">
          {comparisonKeys.map((key) => (
            <div key={key} className="flex items-center">
              {getComparisonIcon(key)}
              <span className="ml-2 text-xs">{key}</span>
              <span className="ml-auto text-xs font-medium">
                {commonAttributes[key] || 'Hidden'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {gameState.pickedSongs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          comparisonKeys={comparisonKeys}
          getComparisonResult={getComparisonResult}
          renderComparisonValue={renderComparisonValue}
        />
      ))}
    </div>
  );
};

const SongCard: React.FC<{
  song: Song,
  comparisonKeys: ComparisonKey[],
  getComparisonResult: (key: ComparisonKey, value: ComparisonResult[ComparisonKey]) => React.ReactNode,
  renderComparisonValue: (key: ComparisonKey, value: ComparisonResult[ComparisonKey], songId: string) => React.ReactNode
}> = ({ song, comparisonKeys, getComparisonResult, renderComparisonValue }) => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-4">
    <div className="flex items-center mb-2">
      <img
        src={song.album.images[0]?.url}
        alt={`${song.name} cover`}
        className="w-12 h-12 object-cover rounded-md shadow-sm mr-2"
      />
      <span className="font-medium text-sm truncate">{song.name}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {comparisonKeys.map((key) => (
        <div key={key} className="flex items-center">
          {getComparisonIcon(key)}
          <span className="ml-2 text-xs">{key}</span>
          <div className="ml-auto flex items-center">
            {getComparisonResult(key, song.comparison[key])}
            <span className="ml-1 text-xs">
              {renderComparisonValue(key, song.comparison[key], song.id)}
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
  const genresList = genres.split(' ');
  const isExpanded = expandedGenres[songId];
  const displayGenres = isExpanded ? genresList : genresList.slice(0, 2);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1">
        {displayGenres.map((genre, index) => (
          <span key={index} className="px-1 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            {genre}
          </span>
        ))}
      </div>
      {genresList.length > 2 && (
        <button
          onClick={() => setExpandedGenres(prev => ({ ...prev, [songId]: !prev[songId] }))}
          className="mt-1 text-xs text-indigo-600 hover:text-indigo-800"
        >
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      )}
    </div>
  );
};

export default SongComparisonTable;