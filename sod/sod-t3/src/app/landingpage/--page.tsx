"use client";
import { useState, useEffect, useCallback } from "react";
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
    refetch: refetchFilteredSongs,
  } = api.spotify.searchTracks.useQuery(
    { searchTerm: submittedSearchTerm },
    { enabled: !!submittedSearchTerm },
  );

  useEffect(() => {
    setIsClient(true);
    // resetGameState();
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

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (dailySongFound) return;
      if (submittedSearchTerm.trim() === searchTerm.trim()) return;
      setSubmittedSearchTerm(searchTerm);
      setDropdownVisible(true);
      refetchFilteredSongs(); // Refetch the filtered songs
    },
    [dailySongFound, searchTerm, submittedSearchTerm, refetchFilteredSongs],
  );

  const handleBlur = () => {
    setSubmittedSearchTerm("");
    setDropdownVisible(false);
  };

  const handleDDSelect = useCallback(
    (song) => {
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
      setSubmittedSearchTerm(""); // Clear the submitted search term
    },
    [dailySong, setDailySongFound, setPickedSongs, updateGuessState],
  );

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
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-pink-500 px-6 py-3 text-white shadow-lg">
              Song already added!
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-8 sm:gap-12">
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[5rem]">
            What is the <span className="text-emerald-300">song</span> of the
            day?
          </h1>

          <div className="w-full max-w-4xl">
            <div className="mb-8 rounded-lg bg-white bg-opacity-10 p-6 shadow-lg">
              <DailySongDisplay
                dailySong={dailySong}
                isFound={dailySongFound}
                isLoading={isLoadingDailySong}
                error={dailySongError}
                guessState={guessState}
              />

              <div className="mt-6">
                <Player
                  song={dailySong}
                  isFound={dailySongFound}
                  isLoading={isLoadingDailySong}
                />
              </div>
            </div>

            <div className="relative mb-8">
              <SearchBar
                searchTerm={searchTerm}
                isDisabled={dailySongFound}
                onSearch={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onSubmit={handleSubmit}
              />

              <div className="absolute left-0 right-0 z-10 mt-1">
                <SongList
                  visible={dropdownVisible}
                  songs={filteredSongs}
                  isLoading={isLoading || isFetching}
                  error={error}
                  onSelect={handleDDSelect}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white bg-opacity-10 p-6 shadow-lg">
              <GuessTable pickedSongs={pickedSongs} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
