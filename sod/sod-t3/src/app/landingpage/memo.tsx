"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Dynamically import client-side components
const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});
const SongList = dynamic(() => import("../components/SongList"), {
  ssr: false,
});
const GuessTable = dynamic(() => import("../components/GuessTable"), {
  ssr: false,
});
const DailySongDisplay = dynamic(
  () => import("../components/DailySongDisplay"),
  { ssr: false },
);
const Player = dynamic(() => import("../components/Player"), { ssr: false });

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [pickedSongs, setPickedSongs] = useLocalStorage("pickedSongs", []);
  const [dailySongFound, setDailySongFound] = useLocalStorage(
    "dailySongFound",
    false,
  );
  const [guessState, updateGuessState] = useLocalStorage("guessState", {
    guessedCorrectly: false,
    attempts: 0,
  });
  const [lastResetDate, setLastResetDate] = useLocalStorage(
    "lastResetDate",
    new Date().toISOString(),
  );

  const {
    data: dailySong,
    isLoading: isLoadingDailySong,
    error: dailySongError,
  } = api.spotify.getDailySong.useQuery();

  const {
    data: filteredSongs = [],
    isFetching,
    isLoading,
    error,
  } = api.spotify.searchTracks.useQuery(
    { searchTerm: submittedSearchTerm },
    { enabled: !!submittedSearchTerm },
  );

  useEffect(() => {
    setIsClient(true);
    resetGameState();
    const intervalId = setInterval(resetGameState, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const isNewDay = (lastResetDate: Date) => {
    const now = new Date();
    return (
      now.getDate() !== lastResetDate.getDate() ||
      now.getMonth() !== lastResetDate.getMonth() ||
      now.getFullYear() !== lastResetDate.getFullYear()
    );
  };

  const resetGameState = () => {
    const now = new Date();
    if (isNewDay(new Date(lastResetDate))) {
      setPickedSongs([]);
      setDailySongFound(false);
      updateGuessState({ guessedCorrectly: false, attempts: 0 });
      setLastResetDate(now.toISOString());
    }
  };

  const compareSongs = (selectedSong: Song, dailySong: Song) => {
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

    if (selectedSong.id === dailySong.id) {
      setDailySongFound(true);
      updateGuessState((prev) => ({ ...prev, guessedCorrectly: true }));
    }

    return commonMetadata;
  };

  const handleSearch = (searchInput: string) => {
    console.log("SEARCH EVENT : ", searchInput);

    setSubmittedSearchTerm("");
    if (dailySongFound) return;
    setSearchTerm(searchInput);
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    if (dailySongFound) return;
    if (submittedSearchTerm.trim() !== "") {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("EVENT : ", e);
    e.preventDefault();
    if (dailySongFound) return;
    // if (!searchTerm.trim()) return;
    if (submittedSearchTerm.trim() === searchTerm.trim()) return;
    setSubmittedSearchTerm(searchTerm);
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    setSubmittedSearchTerm("");
    setDropdownVisible(false);
  };

  const handleDDSelect = (song) => {
    setPickedSongs((prevSongs) => {
      if (prevSongs.some((pickedSong) => pickedSong.id === song.id)) {
        setShowPopup(true);
        return prevSongs;
      }
      const correct = isCorrectGuess(song, dailySong);
      const commonMetadata = correct ? null : compareSongs(song, dailySong);
      if (correct) setDailySongFound(true);
      updateGuessState((prevState) => ({
        ...prevState,
        guessedCorrectly: correct,
        attempts: prevState.attempts + 1,
      }));
      return [
        ...prevSongs,
        { ...song, commonMetadata, isCorrectGuess: correct },
      ];
    });
    setDropdownVisible(false);
    setSearchTerm("");
  };

  const isCorrectGuess = (selectedSong, dailySong) => {
    // Check if the IDs match (primary check)
    if (selectedSong.id === dailySong.id) {
      return true;
    }

    // Secondary checks (if IDs don't match)
    const nameMatch =
      selectedSong.name.toLowerCase() === dailySong.name.toLowerCase();
    const artistMatch = selectedSong.artists.some((artist) =>
      dailySong.artists.some(
        (dailyArtist) =>
          dailyArtist.artist.name.toLowerCase() === artist.name.toLowerCase(),
      ),
    );
    const durationMatch =
      Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= 2000; // Within 2 seconds
    const albumMatch =
      selectedSong.album.name.toLowerCase() ===
      dailySong.album.name.toLowerCase();

    // Consider it a match if name, artist, and either duration or album match
    return nameMatch && artistMatch && (durationMatch || albumMatch);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="rounded bg-pink-500 px-4 py-2 text-white shadow-lg">
              Song already added!
            </div>
          </div>
        )}

        <DailySongDisplay
          dailySong={dailySong}
          isFound={dailySongFound}
          isLoading={isLoadingDailySong}
          error={dailySongError}
          guessState={guessState}
        />

        <Player
          song={dailySong}
          isFound={dailySongFound}
          isLoading={isLoadingDailySong}
        />

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          What is the <span className="text-emerald-300">song</span> of the day
        </h1>

        <SearchBar
          searchTerm={searchTerm}
          isDisabled={dailySongFound}
          onSearch={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />

        <SongList
          visible={dropdownVisible}
          songs={filteredSongs}
          isLoading={isLoading || isFetching}
          error={error}
          onSelect={handleDDSelect}
        />

        <GuessTable pickedSongs={pickedSongs} />
      </div>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import { getCommonGameState, getDailySong } from "../actions/gameActions";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [commonGameState, setCommonGameState] = useState(null);
  const [dailySong, setDailySong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // Client-side state
  const [pickedSongs, setPickedSongs] = useLocalStorage("pickedSongs", []);
  const [dailySongFound, setDailySongFound] = useLocalStorage(
    "dailySongFound",
    false,
  );
  const [guessState, setGuessState] = useLocalStorage("guessState", {
    guessedCorrectly: false,
    attempts: 0,
  });

  useEffect(() => {
    setIsClient(true);
    async function fetchInitialData() {
      try {
        const fetchedCommonGameState = await getCommonGameState();
        setCommonGameState(fetchedCommonGameState);
        const fetchedDailySong = await getDailySong();
        setDailySong(fetchedDailySong);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load game data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (commonGameState) {
      const now = new Date();
      if (isNewDay(new Date(commonGameState.lastResetDate))) {
        resetClientGameState();
      }
    }
  }, [commonGameState]);

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

  const resetClientGameState = () => {
    setPickedSongs([]);
    setDailySongFound(false);
    setGuessState({ guessedCorrectly: false, attempts: 0 });
  };

  const compareSongs = (selectedSong, dailySong) => {
    console.log(dailySong);
    const commonMetadata = {
      sameArtist: selectedSong.artists.some((artist) =>
        dailySong.artists.some(
          (dailyArtist) =>
            dailyArtist.artist.name.toLowerCase() === artist.name.toLowerCase(),
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
      // New comparisons
      sameDecade:
        Math.floor(
          new Date(selectedSong.album.release_date).getFullYear() / 10,
        ) ===
        Math.floor(new Date(dailySong.album.release_date).getFullYear() / 10),
      popularityDifference:
        Math.abs(selectedSong.popularity - dailySong.popularity) <= 10,
      sameDuration:
        Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= 10000, // Within 10 seconds
    };

    if (selectedSong && selectedSong.id === dailySong.id) {
      setDailySongFound(true);
      handleCorrectGuess();
    }

    return commonMetadata;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmittedSearchTerm("");
    if (dailySongFound) return;

    setSearchTerm(e.target.value.toLowerCase());
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    if (dailySongFound) return;
    if (submittedSearchTerm.trim() !== "") {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const {
    data: filteredSongs = [],
    isFetching,
    isLoading,
    error,
  } = api.spotify.searchTracks.useQuery(
    { searchTerm: submittedSearchTerm },
    { enabled: !!submittedSearchTerm },
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dailySongFound) return;
    if (!searchTerm.trim()) return;
    if (submittedSearchTerm.trim() === searchTerm.trim()) return;
    setSubmittedSearchTerm(searchTerm);
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    setSubmittedSearchTerm("");
    setDropdownVisible(false);
  };

  const handleDDSelect = (song) => {
    if (pickedSongs.some((pickedSong) => pickedSong.id === song.id)) {
      setShowPopup(true);
      return;
    }
    const correct = isCorrectGuess(song, dailySong);
    const commonMetadata = correct ? null : compareSongs(song, dailySong);
    if (correct) setDailySongFound(true);
    setGuessState((prevState) => ({
      guessedCorrectly: correct || prevState.guessedCorrectly,
      attempts: prevState.attempts + 1,
    }));
    setPickedSongs((prevSongs) => [
      ...prevSongs,
      { ...song, commonMetadata, isCorrectGuess: correct },
    ]);
    setDropdownVisible(false);
    setSearchTerm("");
  };

  const isCorrectGuess = (selectedSong, dailySong) => {
    // Check if the IDs match (primary check)
    // TODO there maybe duplicates of the same song,
    //  so id comparison wont cut it here
    if (selectedSong.id === dailySong.id) {
      return true;
    }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900">
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded bg-pink-500 px-4 py-2 text-white shadow-lg">
            Song already added!
          </div>
        </div>
      )}

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {/* Game status messages */}
        {dailySongFound && (
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-emerald-400">
              Congratulations!
            </h2>
            <p className="text-white">You've found today's song!</p>
          </div>
        )}

        {guessState.guessedCorrectly ? (
          <div className="text-center">Found it !!!!</div>
        ) : (
          isClient && (
            <p className="text-white">
              Song of the day is hidden. Try to guess it! Attempts:{" "}
              {guessState.attempts}
            </p>
          )
        )}

        {/* Player component */}
        <div>
          <Player song={dailySong} isFound={dailySongFound} isLoading={false} />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          What is the <span className="text-emerald-300">song</span> of the day
        </h1>
      </div>

      {/* Search form */}
      <div className="container mx-auto mb-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder={
                dailySongFound
                  ? "Today's song found!"
                  : "Search by artist or title"
              }
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchTerm}
              disabled={dailySongFound}
              className={`h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out
              ${
                dailySongFound
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-white text-gray-800 shadow-md hover:shadow-lg focus:shadow-lg"
              }
              border-2 outline-none
              ${
                dailySongFound
                  ? "border-gray-300"
                  : "border-indigo-300 focus:border-indigo-500"
              }`}
              aria-expanded={dropdownVisible}
              aria-haspopup="listbox"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <FontAwesomeIcon
                icon={faSearch}
                className={`text-xl ${dailySongFound ? "text-gray-400" : "text-indigo-500"}`}
              />
            </div>
            {!dailySongFound && searchTerm && (
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
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg"
                role="listbox"
                aria-activedescendant=""
              >
                {isLoading || isFetching ? (
                  <li className="p-2 text-center">
                    <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                  </li>
                ) : error ? (
                  <li className="p-2 text-center text-red-500">
                    Error fetching data
                  </li>
                ) : filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <li
                      key={song.id}
                      id={song.id}
                      className="flex cursor-pointer items-center border-b border-gray-700 p-2 hover:bg-[#2e026d] hover:text-white"
                      onMouseDown={() => handleDDSelect(song)} // Use onMouseDown to prevent blur before click
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

      {/* Picked songs table */}
      <div className="container mx-auto">
        {pickedSongs.length > 0 && (
          <div className="mt-8 w-full overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto overscroll-contain rounded-lg pr-2 shadow">
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="sticky top-0 bg-indigo-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700"
                    >
                      Cover
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700"
                    >
                      Artist
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700"
                    >
                      Hints
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-200 bg-white">
                  {pickedSongs.map((song) => (
                    <tr key={song.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <img
                          src={song.album.images[0].url}
                          width={50}
                          height={50}
                          alt=""
                          className="rounded-md"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-300">
                          {song.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-400">
                          {song.artists[0].name}
                        </div>
                      </td>
                      {song.isCorrectGuess ? (
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="mr-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold">
                            Correct Guess!
                          </span>
                        </td>
                      ) : (
                        song.commonMetadata && (
                          <td className="whitespace-nowrap px-6 py-4">
                            {song.commonMetadata && (
                              <div>
                                {song.commonMetadata.sameArtist && (
                                  <span className="mr-2 rounded-full bg-green-500 px-2 py-1 text-xs">
                                    Same Artist
                                  </span>
                                )}
                                {song.commonMetadata.sameAlbum && (
                                  <span className="mr-2 rounded-full bg-blue-500 px-2 py-1 text-xs">
                                    Same Album
                                  </span>
                                )}
                                {song.commonMetadata.sameYear && (
                                  <span className="mr-2 rounded-full bg-yellow-500 px-2 py-1 text-xs">
                                    Same Year
                                  </span>
                                )}
                                {song.commonMetadata.sameGenre && (
                                  <span className="mr-2 rounded-full bg-purple-500 px-2 py-1 text-xs">
                                    Same Genre
                                  </span>
                                )}
                                {song.commonMetadata.sameDecade && (
                                  <span className="mr-2 rounded-full bg-pink-500 px-2 py-1 text-xs">
                                    Same Decade
                                  </span>
                                )}
                                {song.commonMetadata.popularityDifference && (
                                  <span className="mr-2 rounded-full bg-indigo-500 px-2 py-1 text-xs">
                                    Similar Popularity
                                  </span>
                                )}
                                {song.commonMetadata.sameDuration && (
                                  <span className="mr-2 rounded-full bg-teal-500 px-2 py-1 text-xs">
                                    Similar Duration
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
