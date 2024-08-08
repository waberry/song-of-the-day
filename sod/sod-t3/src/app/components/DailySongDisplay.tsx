"use client";

import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Song } from "~/types/spotify";

interface DailySongDisplayProps {
  dailySong: Song | null;
  error: Error | null;
}

export default function DailySongDisplay({
  dailySong,
  error,
}: DailySongDisplayProps) {
  const [dailySongFound] = useLocalStorage("dailySongFound", false);
  const [guessState] = useLocalStorage("guessState", {
    guessedCorrectly: false,
    attempts: 0,
  });

  if (error) {
    return (
      <p className="text-red-400">Error loading daily song: {error.message}</p>
    );
  }

  if (!dailySong) {
    return <p className="text-white">Loading daily song...</p>;
  }

  return (
    <div className="mb-8 text-center">
      {dailySongFound && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-emerald-400">
            Congratulations!
          </h2>
          <p className="text-white">You've found today's song!</p>
        </div>
      )}
      {guessState.guessedCorrectly ? (
        <div className="text-white">
          Found it! The song was "{dailySong.name}" by{" "}
          {dailySong.artists[0]?.name}.
        </div>
      ) : (
        <p className="text-white">
          Song of the day is hidden. Try to guess it! Attempts:{" "}
          {guessState.attempts}
        </p>
      )}
    </div>
  );
}
