<<<<<<< Updated upstream
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
=======
import React, { useState, useEffect } from 'react';
import { getDetailedSongComparison, ComparisonKey } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import { trackType as Song } from "~/types/spotify.types";
import { Flag, Disc, Calendar, Clock, BarChart2, Tag, Globe, Music, CheckCircle2, Check, ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
>>>>>>> Stashed changes

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> = ({ gameState, dailySong }) => {
<<<<<<< Updated upstream
  if (!gameState || !dailySong) return null;

  const comparisonKeys = Object.values(ComparisonKey);

  const commonAttributes = useMemo(() => {
    if (gameState.pickedSongs.length === 0 || !gameState.pickedSongs[0]?.comparison) return {};
    return comparisonKeys.reduce((acc, key) => {
      const correctValues = gameState.pickedSongs
        .map(song => song.comparison[key])
        .filter(value => value.result)
        .map(value => value.dailyValue);

      if (correctValues.length > 0 && new Set(correctValues).size === 1) {
        acc[key] = correctValues[0];
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
=======
  const [commonAttributes, setCommonAttributes] = useState<Partial<Record<ComparisonKey, string>>>({});
  const [comparisons, setComparisons] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!gameState || !dailySong) return;

      const newComparisons: Record<string, any> = {};
      for (const song of gameState.pickedSongs) {
        newComparisons[song.id] = await getDetailedSongComparison(song, dailySong);
      }
      setComparisons(newComparisons);

      const newCommonAttributes: Partial<Record<ComparisonKey, string>> = {};
      Object.values(ComparisonKey).forEach(key => {
        const allValues = Object.values(newComparisons).map(comparison => comparison[key]);
        const correctValues = allValues.filter(value => value.result).map(value => value.selectedValue);

        if (correctValues.length > 0 && new Set(correctValues).size === 1) {
          newCommonAttributes[key] = correctValues[0].toString();
        }
      });

      setCommonAttributes(newCommonAttributes);
    };

    fetchComparisons();
  }, [gameState, dailySong]);

  if (!gameState || !dailySong) {
    return null;
  }

  const getComparisonIcon = (key: ComparisonKey) => {
    switch (key) {
      case ComparisonKey.Artist: return <Globe size={20} />;
      case ComparisonKey.Album: return <Disc size={20} />;
      case ComparisonKey.Year: return <Calendar size={20} />;
      case ComparisonKey.Decade: return <TrendingUp size={20} />;
      case ComparisonKey.Genre: return <Tag size={20} />;
      case ComparisonKey.Popularity: return <BarChart2 size={20} />;
      case ComparisonKey.Duration: return <Clock size={20} />;
      case ComparisonKey.ArtistCountry: return <Flag size={20} />;

      default: return null;
    }
  };

  const getComparisonResult = (key: ComparisonKey, value: any) => {
    if (value.result) {
      return <Check className="text-green-500" size={20} />;
    }
    switch (key) {
      case ComparisonKey.Year:
      case ComparisonKey.Decade:
        return value.comparison === 'higher' ? <ArrowUp className="text-red-500" size={20} /> : <ArrowDown className="text-red-500" size={20} />;
      case ComparisonKey.Popularity:
      case ComparisonKey.Duration:
        return value.comparison === 'higher' ? <ArrowUp className="text-blue-500" size={20} /> : <ArrowDown className="text-blue-500" size={20} />;
      default:
        return <Minus className="text-red-500" size={20} />;
    }
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
                      <span className="text-xs mt-1">{commonAttributes[key] ? 'Common' : 'No match yet'}</span>
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
                          <span className="text-sm truncate mt-1" title={value.message}>
                            {value.selectedValue}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
>>>>>>> Stashed changes
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