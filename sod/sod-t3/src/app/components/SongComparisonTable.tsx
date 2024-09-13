import React, { useState, useEffect, useMemo } from 'react';
import { ComparisonKey, ComparisonResult } from '~/utils/gameUtils';
import { GameState } from '~/types/types';
import {
  Flag, Disc, Calendar, Clock, BarChart2, 
  Tag, Music, CheckCircle2, Check,
  ArrowUp, ArrowDown, Minus, TrendingUp,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, PersonStandingIcon
 } from 'lucide-react';
import { Track as Song } from '@prisma/client';
import GenreDisplay from './Genre';

interface SongComparisonTableProps {
  gameState: GameState | null;
  dailySong: Song | null;
}

const SongComparisonTable: React.FC<SongComparisonTableProps> = ({ gameState, dailySong }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  if (!gameState || !dailySong) {
    return null;
  }
  const comparisonKeys = Object.values(ComparisonKey);

  const commonAttributes = useMemo(() => {
    if (gameState.pickedSongs.length === 0) return {};

    return Object.values(ComparisonKey).reduce((acc, key) => {
      const allValues = gameState.pickedSongs.map(song => {
        // Safely access the comparison property
        const comparison = song.comparison as ComparisonResult | undefined;
        return comparison ? comparison[key] : undefined;
      }).filter(Boolean); // Remove any undefined values

      const correctValues = allValues
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
      [ComparisonKey.Artist]: <PersonStandingIcon size={20} />,
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

  const getComparisonResult = (key: ComparisonKey, value: ComparisonResult[ComparisonKey]) => {
    if (value.result) {
      return <Check className="text-green-500" size={20} />;
    }
    const comparisonIcons = {
      higher: <ArrowUp className="text-red-500" size={20} />,
      lower: <ArrowDown className="text-red-500" size={20} />,
    };
    if ([ComparisonKey.Year, ComparisonKey.Decade, ComparisonKey.Popularity, ComparisonKey.Duration].includes(key)) {
      return comparisonIcons[value.comparison as keyof typeof comparisonIcons] || <Minus className="text-red-500" size={20} />;
    }
    return <Minus className="text-red-500" size={10} />;
  };

  const renderComparisonValue = (key: ComparisonKey, value: ComparisonResult[ComparisonKey], genres?: string[]) => {
    if (key === ComparisonKey.Genre && genres) {
      return (
      <div className="relative">
        <div className="flex flex-wrap justify-center">
        {isMobile && genres.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative transform -translate-x-1/2  rounded-full p-1"
          >
            {isExpanded ? isMobile ? <ChevronRight size={10}/> : <ChevronUp size={12} /> : isMobile ? <ChevronLeft size={10}/> : <ChevronDown size={12} />}
          </button>
          )}
          {(isExpanded ? genres : genres.slice(0, 2)).map((genre, index) => (
            <span key={index} className="pl-1 pr-1 px-2 py-1  text-indigo-800  text-xs rounded-full">
              {genre}
            </span>
          ))}
        </div>
        {!isMobile && genres.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-3 transform -translate-x-1/2  bg-indigo-100 rounded-full p-1"
          >
            {isExpanded ? isMobile ? <ChevronRight size={10}/> : <ChevronUp size={12} /> : isMobile ? <ChevronLeft size={10}/> : <ChevronDown size={12} />}
          </button>
          )}
        </div>
        );
    }
    return (
      <span className="text-xs sm:text-sm  truncate mt-1 rounded-full" title={value.message}>
        {value.selectedValue}
      </span>
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % comparisonKeys.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + comparisonKeys.length) % comparisonKeys.length);
  };

   const renderMobileView = () => (
    <div className="relative pb-12">
      <button onClick={prevSlide} className="absolute left-0 bottom-2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10">
        <ChevronLeft size={16} />
      </button>
      <button onClick={nextSlide} className="absolute right-0 bottom-2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10">
        <ChevronRight size={16} />
      </button>
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {comparisonKeys.map((key) => (
            <div key={key} className="flex-shrink-0 w-full px-4">
              <h3 className="text-center font-semibold mb-2 text-sm">{key}</h3>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 mb-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Common:</span>
                  <span className="text-xs">{commonAttributes[key] || 'Hidden'}</span>
                </div>
              </div>
              <div className="space-y-2">
                {gameState.pickedSongs.map((song) => (
                  <div key={song.id} className="flex items-center justify-between bg-white p-2 rounded shadow">
                    <span className="text-xs truncate max-w-[40%]">{song.name}</span>
                    <div className="flex items-center space-x-2">
                      {getComparisonResult(key, song.comparison[key])}
                      {renderComparisonValue(key, song.comparison[key], song.genres)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mt-4">
        {comparisonKeys.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${index === currentSlide ? 'bg-indigo-500' : 'bg-gray-300'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );

    const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm sticky top-0 z-10">
            <th className="p-2 sm:p-4 text-left font-semibold rounded-tl-xl">
              <div className="flex items-center space-x-2">
                <Music size={16} />
                <span>Mystery Song</span>
              </div>
            </th>
            {comparisonKeys.map((key, index) => (
              <th key={key} className={`p-2 sm:p-4 text-center font-semibold ${index === comparisonKeys.length - 1 ? 'rounded-tr-xl' : ''}`}>
                <div className="flex flex-col items-center justify-center">
                  {getComparisonIcon(key)}
                  <span className="mt-1 text-xs">{key}</span>
                </div>
              </th>
            ))}
          </tr>
          <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800 text-xs sm:text-sm sticky top-10 sm:top-14 z-10 shadow-lg">
            <td className="p-2 sm:p-3 text-left font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>Common</span>
              </div>
            </td>
            {comparisonKeys.map((key) => (
              <td key={key} className="p-2 sm:p-3 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-medium">{commonAttributes[key] || 'Hidden'}</span>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {gameState.pickedSongs.map((song, index) => (
            <tr key={song.id} className="transition-colors duration-150 ease-in-out hover:bg-gray-50">
              <td className={`p-2 sm:p-3 ${index === gameState.pickedSongs.length - 1 ? 'rounded-bl-xl' : ''}`}>
                <div className="flex items-center space-x-2">
                  <img
                    src={song.album.images[0]?.url}
                    alt={`${song.name} cover`}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-md shadow-sm"
                  />
                  <span className="font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{song.name}</span>
                </div>
              </td>
              {comparisonKeys.map((key, colIndex) => (
                <td 
                  key={key} 
                  className={`p-2 sm:p-3 text-center ${index === gameState.pickedSongs.length - 1 && colIndex === comparisonKeys.length - 1 ? 'rounded-br-xl' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center">
                    {getComparisonResult(key, song.comparison[key])}
                    <div className="text-xs mt-1">
                      {renderComparisonValue(key, song.comparison[key], song.genres)}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // return (
  //   <div className="w-full mx-auto overflow-hidden">
  //     <div className="rounded-xl shadow-md bg-white overflow-hidden">
  //       {isMobile ? renderMobileView() : renderDesktopView()}
  //     </div>
  //   </div>
  // );
  return (
    <div className="container w-full mx-auto overflow-hidden">
      <div className="rounded-xl shadow-md bg-white overflow-hidden">
        {isMobile ? 
          <div className="md:hidden">
            {renderMobileView()}
          </div>
        :
          <div className="hidden md:block overflow-x-auto">
            {renderDesktopView()}
          </div>
        }
      </div>
    </div>
  );
};

export default SongComparisonTable;