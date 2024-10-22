"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "~/trpc/react";

export function Songs() {
  const queryClient = useQueryClient(); // Initialize the query client

  // State for form input
  const [chosenModeId, setChosenModeId] = useState("");
  const [userAnonymousId, setUserAnonymousId] = useState("");
  const [songSpotifyId, setSongSpotifyId] = useState("");

  // Query to get the song, based on input
  const { data: songToGuess, error, isFetching } = api.song.getSongToGuess.useQuery(
    {
      anonymousUserId: userAnonymousId,
      modeId: parseInt(chosenModeId) || 0, // Convert to number or fallback to 0
      songSpotifyId: songSpotifyId
    },
    {
      enabled: !!userAnonymousId && !!chosenModeId, // Only fetch if input is valid
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-xs">
      {isFetching ? (
        <p>Loading song...</p>
      ) : error ? (
        <p>Error fetching song: {error.message}</p>
      ) : songToGuess ? (
        <p className="truncate">
          Chosen mode: name = {songToGuess.mode.name}, playlistId = {songToGuess.mode.playlistId}
          <br />
          Today's date: {new Date(songToGuess.dayEntry.date).toLocaleDateString()}
          <br />
          Today's seed: {songToGuess.dayEntry.seed}
        </p>
      ) : (
        <p>No song to guess</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="integer"
          placeholder="Mode ID"
          value={chosenModeId}
          onChange={(e) => setChosenModeId(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="User Anonymous ID"
          value={userAnonymousId}
          onChange={(e) => setUserAnonymousId(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="User Anonymous ID"
          value={userAnonymousId}
          onChange={(e) => setUserAnonymousId(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={isFetching}
        >
          {isFetching ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}