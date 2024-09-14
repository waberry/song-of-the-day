"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getGameState, getCommonGameState, getDailySong, saveGameState, getYesterdaySong, setDailySongFound } from "../actions/gameActions";
import { api } from "~/trpc/react";
import LoadingScreen from "../components/loadingScreen";
import ErrorDisplay from "../components/ErrorDisplay";
import { PlayerProvider } from "../components/PlayerContext";
import { getAnonymousUserId } from "~/utils/anonymousUserId";
import SongComparisonTable from "../components/SongComparisonTable";
import { GameState, SongWithGenres } from "~/types/types";
import WinAnimation from "../components/WinAnimation";
import EnhancedGameHeader from "../components/Header";
import RulesPopup from "../components/RulesPopup";
import { YesterdayGuess, YesterdayGuessProps } from "../components/YesterdayGuess";


export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [commonGameState, setCommonGameState] = useState(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [dailySong, setDailySong] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);
  const [yesterdaySong, setYesterdaySong] = useState<YesterdayGuessProps | null >(null);


  useEffect(() => {
    async function fetchYesterdaySong() {
      const song = await getYesterdaySong();
      setYesterdaySong(song);
    }
    fetchYesterdaySong();
  }, []);

  const searchTracksQuery = api.spotify.searchTracks.useQuery(
    { searchTerm },
    {
      enabled: !!searchTerm,
    }
  );

  useEffect(() => {
    async function initializeGameState() {
      try {
        setIsLoading(true);
        const userId = await getAnonymousUserId();
        setAnonymousUserId(userId);
        const commonState = await getCommonGameState();
        setCommonGameState(commonState);
        
        // Initialize game state
        const currentGameState = await initializeOrResetGameState(userId);
        setGameState(currentGameState);
        setIsLoading(false);

        // Fetch daily song
        const fetchedDailySong = await getDailySong();
        // if (fetchedDailySong) {
        //   const dailyArtistIds = fetchedDailySong.artists.map(artist => artist.id);
        //   const dailyArtistsInfo = await getArtistsInfo(dailyArtistIds.join(","));
        //   const dailyGenres = Array.from(new Set(dailyArtistsInfo.flatMap(artist => artist.genres)));
          
        
        // }
        setDailySong({
          ...fetchedDailySong,
        });
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to load game data. Please try again later.");
        setIsLoading(false);
      }
    }

    initializeGameState();
  }, []);

  useEffect(() => {
    if (gameState?.dailySongFound && anonymousUserId) {
      saveGameState(anonymousUserId, gameState).catch(err => {
        console.error("Failed to save game state to the database:", err);
      });
    }
  }, [gameState]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

 
  const initializeOrResetGameState = async (userId: string): Promise<GameState> => {
    const today = new Date();
    const gameStateFromStorage = localStorage.getItem(`gameState_${userId}`);
    
    if (gameStateFromStorage) {
      const parsedGameState = JSON.parse(gameStateFromStorage);
      const lastResetDate = new Date(parsedGameState.lastResetDate);
      const isSameDay = lastResetDate.toDateString() === today.toDateString();
  
      if (!isSameDay) {
        return await resetClientGameState(userId);
      }
      return parsedGameState;
    } else {
      // Pass true to indicate that localStorage is empty
      const newGameState = await getGameState(userId, true);
      localStorage.setItem(`gameState_${userId}`, JSON.stringify(newGameState));
      return newGameState;
    }
  };

  const resetClientGameState = async (userId: string): Promise<any> => {
    const newGameState = {
      pickedSongs: [],
      dailySongFound: false,
      guessState: { guessedCorrectly: false, attempts: 0 },
      lastResetDate: new Date().toISOString()
    };
    await saveGameState(userId, newGameState);
    return newGameState;
  };

  const handleSearch = (value: string) => {
    if (gameState?.dailySongFound) return;
    setSearchTerm(value.toLowerCase())
    if (value.trim() !== "") {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleFocus = () => {
    if (gameState?.dailySongFound) return;
    if (searchTerm.trim() !== "") {
      setDropdownVisible(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  const handleDDSelect = async (selectedSong) => {
    if (!anonymousUserId || !gameState || !dailySong) return;
    if (gameState.pickedSongs.some((pickedSong) => pickedSong.id === selectedSong.id)) {
      setShowPopup(true);
      return;
    }
    
    try {
    
    
      const newGameState = {
        ...gameState,
        pickedSongs: [selectedSong,
          ...gameState.pickedSongs],
      };
    
      // Save the game state, which will perform the comparison on the server
      const updatedGameState = await saveGameState(anonymousUserId, newGameState);
  
      // Update the local state with the new game state (including comparison data)
      setGameState(updatedGameState);
  
      // Update localStorage with the new game state
      localStorage.setItem(`gameState_${anonymousUserId}`, JSON.stringify(updatedGameState));
  
      console.log("Updated game state:", updatedGameState);
      setDropdownVisible(false);
      setSearchTerm("");
      // setDailySongFound(updatedGameState.guessState.guessedCorrectly);
    } catch (error) {
      console.error("Failed to save game state:", error);
      setError("Failed to save your guess. Please try again.");
    }
  };

  if (!gameState && !dailySong && isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <PlayerProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900">
      <RulesPopup />
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="ro
            d bg-pink-500 px-4 py-2 text-white shadow-lg">
              Song already added!
            </div>
          </div>
        )}
        {gameState?.dailySongFound && <WinAnimation />}
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <EnhancedGameHeader gameState={gameState} />
          <YesterdayGuess song={yesterdaySong} />
        </div>

        <div className="container mx-auto mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={
                gameState?.dailySongFound
                  ? "Today's song found!"
                  : "Search by artist or title"
              }
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchTerm}
              disabled={gameState?.dailySongFound}
              className={`h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out
                  ${
                    gameState?.dailySongFound
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                      : "border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg"
                  } border-2 outline-none`}
              aria-expanded={dropdownVisible}
              aria-haspopup="listbox"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <FontAwesomeIcon
                icon={faSearch}
                className={`text-xl ${gameState?.dailySongFound ? "text-gray-400" : "text-indigo-500"}`}
              />
            </div>
            {!gameState?.dailySongFound && searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            )}
            {dropdownVisible && (
              <ul
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg"
              role="listbox"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
              }}
            >
                {searchTracksQuery.isLoading || searchTracksQuery.isFetching ? (
                  <li className="p-2 text-center">
                    <FontAwesomeIcon icon={faSpinner} spin /> Searching...
                  </li>
                ) : searchTracksQuery.error ? (
                  <li className="p-2 text-center text-red-500">
                    Error fetching data
                  </li>
                ) : searchTracksQuery.data && searchTracksQuery.data.length > 0 ? (
                  searchTracksQuery.data.map((song) => (
                    <li
                      key={song.id}
                      className="flex cursor-pointer items-center border-b border-gray-700 p-2 hover:bg-[#2e026d] hover:text-white"
                      onMouseDown={() => handleDDSelect(song)}
                      role="option"
                    >
                      <img
                        src={song.album.images[0].url}
                        width={50}
                        height={50}
                        alt=""
                        className="mr-3 rounded-md"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{song.name}</h3>
                        <p className="text-xs text-gray-400">
                          {song.artists[0].name}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center">No results found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        
        {gameState && dailySong ? (
          <div className="relative z-0 w-full">
            <SongComparisonTable gameState={gameState} dailySong={dailySong} />
          </div>
        ) : (
          <div className="text-center text-white">
            <p>Unable to load game data. Please try refreshing the page.</p>
          </div>
        )}
      </main>
    </PlayerProvider>
  );
}
