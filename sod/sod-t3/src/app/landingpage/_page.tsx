"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/trpc/react";
import Player from "../components/Player";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Song {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  genres?: string[];
}

interface GuessState {
  guessedCorrectly: boolean;
  attempts: number;
}

function getHintColor(hint: string): string {
  const colors = {
    sameArtist: "bg-green-500",
    sameAlbum: "bg-blue-500",
    sameYear: "bg-yellow-500",
    sameGenre: "bg-purple-500",
    sameDecade: "bg-pink-500",
    popularityDifference: "bg-indigo-500",
    sameDuration: "bg-teal-500",
  };
  return colors[hint as keyof typeof colors] ?? "bg-gray-500";
}

function formatHintText(hint: string): string {
  const texts = {
    sameArtist: "Same Artist",
    sameAlbum: "Same Album",
    sameYear: "Same Year",
    sameGenre: "Same Genre",
    sameDecade: "Same Decade",
    popularityDifference: "Similar Popularity",
    sameDuration: "Similar Duration",
  };
  return texts[hint as keyof typeof texts] ?? hint;
}

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [pickedSongs, setPickedSongs] = useLocalStorage<Song[]>(
    "pickedSongs",
    [],
  );
  const [dailySongFound, setDailySongFound] = useLocalStorage(
    "dailySongFound",
    false,
  );
  const [guessState, updateGuessState] = useLocalStorage<GuessState>(
    "guessState",
    {
      guessedCorrectly: false,
      attempts: 0,
    },
  );
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

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2000);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (dailySongFound) return;
    setSearchTerm(e.target.value.toLowerCase());
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    if (dailySongFound) return;
    setDropdownVisible(!!submittedSearchTerm.trim());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      dailySongFound ||
      !searchTerm.trim() ||
      submittedSearchTerm.trim() === searchTerm.trim()
    )
      return;
    setSubmittedSearchTerm(searchTerm);
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  const handleDDSelect = (song: Song) => {
    setPickedSongs((prevSongs) => {
      if (prevSongs.some((pickedSong) => pickedSong.id === song.id)) {
        setShowPopup(true);
        return prevSongs;
      }
      const correct = isCorrectGuess(song, dailySong!);
      const commonMetadata = correct ? null : compareSongs(song, dailySong!);
      if (correct) setDailySongFound(true);
      updateGuessState((prev) => ({ ...prev, attempts: prev.attempts + 1 }));
      return [
        ...prevSongs,
        { ...song, commonMetadata, isCorrectGuess: correct },
      ];
    });
    setDropdownVisible(false);
    setSearchTerm("");
  };

  const isCorrectGuess = (selectedSong: Song, dailySong: Song) => {
    if (selectedSong.id === dailySong.id) return true;

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="rounded bg-pink-500 px-4 py-2 text-white shadow-lg">
              You've already guessed this song!
            </div>
          </div>
        )}
        {dailySongFound && (
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-emerald-400">
              Congratulations!
            </h2>
            <p className="text-white">You've found today's song!</p>
          </div>
        )}
        {dailySongError ? (
          <p className="text-red-400">
            Error loading daily song: {dailySongError.message}
          </p>
        ) : guessState?.guessedCorrectly ? (
          <div className="text-center text-white">Found it!</div>
        ) : (
          isClient && (
            <p className="text-white">
              Song of the day is hidden. Try to guess it! Attempts:{" "}
              {guessState.attempts}
            </p>
          )
        )}

        <Player
          song={dailySong}
          isFound={dailySongFound}
          isLoading={isLoadingDailySong}
        />

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          What is the <span className="text-emerald-300">song</span> of the day
        </h1>
      </div>

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

      <div className="container mx-auto">
        {pickedSongs.length > 0 && (
          <div className="mt-8 w-full overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto overscroll-contain rounded-lg pr-2 shadow">
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="sticky top-0 bg-indigo-100">
                  <tr>
                    {["Cover", "Title", "Artist", "Hints"].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700"
                      >
                        {header}
                      </th>
                    ))}
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
                        <div className="text-sm font-medium text-gray-900">
                          {song.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {song.artists[0].name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {song.isCorrectGuess ? (
                          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                            Correct Guess!
                          </span>
                        ) : (
                          song.commonMetadata && (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(song.commonMetadata)
                                .filter(([, value]) => value)
                                .map(([key]) => (
                                  <span
                                    key={key}
                                    className={`rounded-full px-2 py-1 text-xs text-white ${getHintColor(
                                      key,
                                    )}`}
                                  >
                                    {formatHintText(key)}
                                  </span>
                                ))}
                            </div>
                          )
                        )}
                      </td>
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
