"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  getGameState,
  getCommonGameState,
  getDailySong,
  updateGameState,
  saveGameState,
} from "../actions/gameActions";
import { api } from "~/trpc/react";
import Player from "../components/Player";
import LoadingScreen from "../components/loadingScreen";
// import ErrorDisplay from "../components/ErrorDisplay";
import { PlayerProvider } from "../components/PlayerContext";
import { getAnonymousUserId } from "~/utils/anonymousUserId";
import {SongComparisonTable} from "../components/SongComparisonTable";

export default function LandingPage() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [commonGameState, setCommonGameState] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [dailySong, setDailySong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);

  // Query to fetch filtered songs
  const {
    data: filteredSongs = [],
    isFetching,
    isLoading: searchLoading,
    error: searchError,
  } = api.spotify.searchTracks.useQuery(
    { searchTerm: searchTerm },
    {
      enabled: !!searchTerm,
    }
  );

  useEffect(() => {
    setIsClient(true);
    async function initializeGameState() {
      try {
        const userId = await getAnonymousUserId(); // Ensures asynchronous handling
        setAnonymousUserId(userId);
        const commonState = await getCommonGameState();
        setCommonGameState(commonState);
        const today = new Date();
        const gameStateFromStorage = localStorage.getItem(`gameState_${userId}`);
        let currentGameState;

        if (gameStateFromStorage) {
          const parsedGameState = JSON.parse(gameStateFromStorage);
          const lastResetDate = new Date(parsedGameState.lastResetDate);
          const isSameDay = lastResetDate.toDateString() === today.toDateString();

          if (!isSameDay) {
            currentGameState = await resetClientGameState(userId);
          } else {
            currentGameState = parsedGameState;
          }
        } else {
          currentGameState = await getGameState(userId);
          localStorage.setItem(`gameState_${userId}`, JSON.stringify(currentGameState));
        }

        setGameState(currentGameState);
        const dailySong = await getDailySong();
        setDailySong(dailySong);

      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to load game data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    initializeGameState();
  }, []);

  // useEffect(() => {
  //   if (gameState?.dailySongFound) {
  //     saveGameState(anonymousUserId, gameState).catch(err => {
  //       console.error("Failed to save game state to the database:", err);
  //     });
  //   }
  // }, [gameState?.dailySongFound, anonymousUserId, gameState]);

  useEffect(() => {
    if (gameState?.dailySongFound) {
      saveGameState(anonymousUserId, gameState).catch(err => {
        console.error("Failed to save game state to the database:", err);
      });
    }

    // Set up an interval to save the game state every minute
    const intervalId = setInterval(() => {
      if (gameState && anonymousUserId) {
        console.log("Automatically saving game state to the database...");
        saveGameState(anonymousUserId, gameState).catch(err => {
          console.error("Failed to periodically save game state:", err);
        });
      }
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [gameState?.dailySongFound, gameState, anonymousUserId]);


  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const isNewDay = (lastResetDate: Date) => {
    const now = new Date();
    return (
      now.getDate() !== lastResetDate.getDate() ||
      now.getMonth() !== lastResetDate.getMonth() ||
      now.getFullYear() !== lastResetDate.getFullYear()
    );
  };

  useEffect(() => {
    if (anonymousUserId && gameState) {
      localStorage.setItem(
        `gameState_${anonymousUserId}`,
        JSON.stringify(gameState),
      );
    }
  }, [gameState, anonymousUserId]);

  const resetClientGameState = async (userId) => {
    const newGameState = {
      pickedSongs: [],
      dailySongFound: false,
      guessState: { guessedCorrectly: false, attempts: 0 },
      lastResetDate: new Date().toISOString()
    };
    await saveGameState(userId, newGameState);
    return newGameState;
  };

  const compareSongs = (selectedSong, dailySong) => {
    const commonMetadata = {
      sameArtist: selectedSong.artists.some((artist) =>
        dailySong.artists.some(
          (dailyArtist) =>
            dailyArtist.name.toLowerCase() === artist.name.toLowerCase(),
        ),
      ),
      sameAlbum:
        selectedSong.album.name.toLowerCase() ===
        dailySong.album.name.toLowerCase(),
      sameYear:
        new Date(selectedSong.album.release_date).getFullYear() ===
        new Date(dailySong.album.release_date).getFullYear(),
      sameGenre:
        selectedSong.genres && dailySong.genres
          ? selectedSong.genres.some((genre) =>
              dailySong.genres.some(
                (dailyGenre) =>
                  dailyGenre.toLowerCase().includes(genre.toLowerCase()) ||
                  genre.toLowerCase().includes(dailyGenre.toLowerCase()),
              ),
            )
          : false,
      sameDecade:
        Math.floor(
          new Date(selectedSong.album.release_date).getFullYear() / 10,
        ) ===
        Math.floor(new Date(dailySong.album.release_date).getFullYear() / 10),
      popularityDifference:
        Math.abs(selectedSong.popularity - dailySong.popularity) <= 10,
      sameDuration:
        Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= 10000,
    };

    return commonMetadata;
  };

  const handleSearch = (value: string) => {
    if (gameState?.dailySongFound) return;
    console.log("EVENT: ", value);

    setSearchTerm(value.toLowerCase());
    setSubmittedSearchTerm(searchTerm);
    if (searchTerm.trim() === "") return;
    setDropdownVisible(true);
  };

  const handleFocus = (value: React.FocusEvent<HTMLInputElement>) => {
    if (gameState?.dailySongFound) return;
    if (searchTerm.trim() !== "") {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }

  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent the default form submission

      const form = e.currentTarget; // Reference to the form element
      const input = form.elements.namedItem('searchInput') as HTMLInputElement; // Adjust 'searchInput' to your input's name attribute
      const inputValue = input ? input.value : '';

      handleSearch(inputValue);
    };

  const handleBlur = () => {
    setTimeout(() => {
      setSubmittedSearchTerm("");
      setDropdownVisible(false);
    }, 200);
  };

  const handleDDSelect = async (song) => {
    if (!anonymousUserId || !gameState) return;
    if (gameState.pickedSongs.some((pickedSong) => pickedSong.id === song.id)) {
      setShowPopup(true);
      return;
    }
    const correct = isCorrectGuess(song, dailySong);
    const commonMetadata = correct ? null : compareSongs(song, dailySong);

    const newPickedSongs = [
      ...gameState.pickedSongs,
      { ...song, commonMetadata, isCorrectGuess: correct },
    ];
    const newGuessState = {
      guessedCorrectly: correct || gameState.guessState.guessedCorrectly,
      attempts: gameState.guessState.attempts + 1,
    };

    const newGameState = {
      ...gameState,
      pickedSongs: newPickedSongs,
      dailySongFound: correct || gameState.dailySongFound,
      guessState: newGuessState,
    };

    const updatedGameState = await saveGameState(anonymousUserId, newGameState);
    setGameState(updatedGameState);
    setDropdownVisible(false);
    setSearchTerm("");
  };

  const isCorrectGuess = (selectedSong, dailySong) => {
    if (selectedSong.id === dailySong.id) {
      return true;
    }

    const nameMatch =
      selectedSong.name.toLowerCase() === dailySong.name.toLowerCase();
    const artistMatch = selectedSong.artists.some((artist) =>
      dailySong.artists.some(
        (dailyArtist) =>
          dailyArtist.name.toLowerCase() === artist.name.toLowerCase(),
      ),
    );
    const durationMatch =
      Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= 2000;
    const albumMatch =
      selectedSong.album.name.toLowerCase() ===
      dailySong.album.name.toLowerCase();

    return nameMatch && artistMatch && (durationMatch || albumMatch);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return; //<ErrorDisplay message = { "Failed to load"} />;
  }

  return (
    <PlayerProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900">
        {/* Popup for already added song */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="rounded bg-pink-500 px-4 py-2 text-white shadow-lg">
              Song already added!
            </div>
          </div>
        )}

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Game status messages */}
          {gameState?.dailySongFound ? (
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-emerald-400">
                Congratulations!
              </h2>
              <p className="text-white">You've found today's song!</p>
            </div>
          ) : (
            isClient && (
              <p className="text-white">
                Song of the day is hidden. Try to guess it! Attempts:{" "}
                {gameState?.pickedSongs.length || 0}
              </p>
            )
          )}

          {/* Player component */}
          <div>
            <Player
              song={dailySong}
              isFound={gameState?.dailySongFound || false}
              isLoading={isLoading}
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            What is the <span className="text-emerald-300">song</span> of the
            day
          </h1>
        </div>

        {/* Search form */}
        <div className="container mx-auto mb-4">
          <form onSubmit={handleSubmit}>
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
              {/* Dropdown for search results */}
              {dropdownVisible && (
                <ul
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg"
                  role="listbox"
                >
                  {isLoading || isFetching ? (
                    <li className="p-2 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin /> Searching...
                    </li>
                  ) : searchError ? (
                    <li className="p-2 text-center text-red-500">
                      Error fetching data
                    </li>
                  ) : filteredSongs.length > 0 ? (
                    filteredSongs.map((song) => (
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
          </form>
        </div>

      <div>
        <SongComparisonTable selectedSong={pickedSongs} dailySong={dailySong} />
      </div>
      </main>
    </PlayerProvider>
  );
}
