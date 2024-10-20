import React, { useState, useMemo, useCallback } from 'react';
import { ComparisonKey, ComparisonResult } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import {
  Flag, Disc, Calendar, Clock, BarChart2, 
  Tag, Music, CheckCircle2, Check,
  ArrowUp, ArrowDown, Minus, TrendingUp,
  ChevronDown, ChevronUp, ExternalLink,
  PersonStanding
} from 'lucide-react';
import { Track as Song } from '@prisma/client'

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> = ({ gameState, dailySong }) => {
  if (!gameState || !dailySong) return null;

  const comparisonKeys = Object.values(ComparisonKey);

  const commonAttributes = useMemo(() => {
    if (gameState.pickedSongs.length === 0 || !gameState.pickedSongs[0]?.comparison) return {};
    
    return comparisonKeys.reduce((acc, key) => {
      const correctValues = gameState.pickedSongs
        .map(song => song.comparison[key])
        .filter(value => value.result)
        .map(value => value.dailyValue);

      if (correctValues.length > 0) {
        if (Array.isArray(correctValues[0])) {
          // For array values (like genres), find the intersection
          const intersection = correctValues.reduce((a, b) => 
            a.filter(value => b.includes(value))
          );
          if (intersection.length > 0) {
            acc[key] = intersection;
          }
        } else if (new Set(correctValues).size === 1) {
          // For single values, use the common value if all are the same
          acc[key] = correctValues[0];
        }
      }
      return acc;
    }, {} as Partial<Record<ComparisonKey, string | string[]>>);
  }, [gameState, comparisonKeys]);

  const latestComparisonData = useMemo(() => {
    return gameState.pickedSongs.length > 0 ? gameState.pickedSongs[gameState.pickedSongs.length - 1].comparison : null;
  }, [gameState]);
  return (
    <div className="container mx-auto mb-4">
      <div className="bg-white rounded-xl shadow-md p-3">
        <MysteryRow 
          comparisonKeys={comparisonKeys} 
          commonAttributes={commonAttributes} 
          dailySong={dailySong}
          isFound={gameState.dailySongFound}
          latestComparisonData={latestComparisonData}
        />
        {gameState.pickedSongs.map((song, index) => (
          <MemoizedSongRow 
            key={song.id} 
            song={song} 
            comparisonKeys={comparisonKeys} 
          />
        ))}
      </div>
    </div>
  );
};

const MysteryRow: React.FC<{ 
  comparisonKeys: ComparisonKey[],
  commonAttributes: Partial<Record<ComparisonKey, string | string[]>>,
  dailySong: Song,
  isFound: boolean,
  latestComparisonData: Record<ComparisonKey, ComparisonResult> | null
}> = React.memo(({ comparisonKeys, commonAttributes, dailySong, isFound, latestComparisonData }) => (
  <div className="mb-3 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg">
    {isFound ? (
      <RevealedSong 
        dailySong={dailySong} 
        comparisonKeys={comparisonKeys} 
        latestComparisonData={latestComparisonData}
      />
    ) : (
      <MysteryContent comparisonKeys={comparisonKeys} commonAttributes={commonAttributes} />
    )}
  </div>
));

const RevealedSong: React.FC<{ 
  dailySong: Song, 
  comparisonKeys: ComparisonKey[],
  latestComparisonData: Record<ComparisonKey, ComparisonResult> | null
}> = ({ dailySong, comparisonKeys, latestComparisonData }) => (
  <div className="text-white">
    <h3 className="text-2xl font-bold mb-4">Today's Song Revealed!</h3>
    <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
      <img 
        src={dailySong.album.images[0]?.url} 
        alt={dailySong.name} 
        className="w-48 h-48 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6"
      />
      <div className="text-center md:text-left">
        <h4 className="text-xl font-semibold mb-2">{dailySong.name}</h4>
        <p className="text-lg mb-1">{dailySong.artists.map((a: any) => a.name).join(', ')}</p>
        <p className="text-md mb-2">
          <span className="font-medium">Album:</span> {dailySong.album.name}
        </p>
        <p className="text-sm mb-3">
          <span className="font-medium">Released:</span> {new Date(dailySong.album.release_date).getFullYear()}
        </p>
        <a 
          href={dailySong.external_urls.spotify} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
        >
          <Music className="mr-2" size={18} />
          Listen on Spotify
          <ExternalLink className="ml-1" size={14} />
        </a>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      {comparisonKeys.map((key) => (
        <div key={key} className="bg-white bg-opacity-10 p-3 rounded-lg">
          <div className="flex items-center mb-1 text-green-300">
            {getComparisonIcon(key)}
            <span className="ml-2 font-semibold">{key}</span>
          </div>
          <div className="text-white font-medium">
            {latestComparisonData && latestComparisonData[key]
              ? formatValue(latestComparisonData[key].dailyValue, key)
              : formatValue(dailySong[key.toLowerCase() as keyof Song], key)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MysteryContent: React.FC<{ 
  comparisonKeys: ComparisonKey[], 
  commonAttributes: Partial<Record<ComparisonKey, string | string[]>>
}> = ({ comparisonKeys, commonAttributes }) => (
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
          <span className="ml-auto">
            {commonAttributes[key] ? (
              <span className="text-green-300 font-semibold glow">{formatValue(commonAttributes[key])}</span>
            ) : (
              <span className="text-red-400 font-semibold">Hidden</span>
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SongRow: React.FC<{ 
  song: Song & { comparison: ComparisonResult }, 
  comparisonKeys: ComparisonKey[],
}> = ({ song, comparisonKeys }) => {
  const [expandedValues, setExpandedValues] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((key: string) => {
    setExpandedValues(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="mb-3 p-3 bg-gray-100 rounded-lg transition-colors duration-300 hover:bg-gray-200">
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
                <ArrayValueDisplay 
                  values={Array.isArray(song.comparison[key].selectedValue) 
                    ? song.comparison[key].selectedValue 
                    : [song.comparison[key].selectedValue]}
                  isExpanded={expandedValues[key]}
                  toggleExpand={() => toggleExpand(key)}
                  isCorrect={song.comparison[key].result}
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MemoizedSongRow = React.memo(SongRow);

const ArrayValueDisplay: React.FC<{ 
  values: string[], 
  isExpanded: boolean,
  toggleExpand: () => void,
  isCorrect: boolean
}> = React.memo(({ values, isExpanded, toggleExpand, isCorrect }) => {
  const displayValues = isExpanded ? values : [values[0]];

  return (
    <div className="flex flex-wrap items-center">
      {displayValues.map((value, index) => (
        <span key={index} className={`mr-1 mb-1 ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        } font-medium`}>
          {value}
        </span>
      ))}
      {values.length > 1 && (
        <button
          onClick={toggleExpand}
          className="text-indigo-600 hover:text-indigo-800 ml-1"
        >
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {isExpanded ? 'Less' : `+${values.length - 1}`}
        </button>
      )}
    </div>
  );
});


const getComparisonIcon = (key: ComparisonKey): React.ReactNode => {
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

const getComparisonResult = (key: ComparisonKey, value: ComparisonResult[ComparisonKey]): React.ReactNode => {
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

const formatValue = (value: any, key: ComparisonKey): string => {
  if (Array.isArray(value)) {
    return value.map(item => formatValue(item, key)).join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    if ('name' in value) return value.name;
    if ('url' in value) return value.url;
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    if (key === ComparisonKey.Duration) {
      const minutes = Math.floor(value / 60000);
      const seconds = ((value % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds.padStart(2, '0')}`;
    }
    if (key === ComparisonKey.Popularity) {
      return `${value}%`;
    }
  }
  return value?.toString() || 'N/A';
};


export default React.memo(SongComparisonTable);