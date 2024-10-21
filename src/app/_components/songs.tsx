"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "~/trpc/react";

export function Songs() {
  const [songToGuess] = api.song.getSongToGuess.useSuspenseQuery();
  const queryClient = useQueryClient(); // Initialize the query client

  const [songSpotifyId, setSongSpotifyId] = useState("");
  const guessSong = api.song.guess.useMutation({
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries('getSongToGuess'); // Invalidate the query
    }
  });

  return (
    <div className="w-full max-w-xs">
      {songToGuess ? (
        <p className="truncate">Song to Guess: {songToGuess.songSpotifyID}</p>
      ) : (
        <p>No song to guess</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guessSong.mutate({ songSpotifyId: songSpotifyId });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Song Spotify ID"
          value={songSpotifyId}
          onChange={(e) => setSongSpotifyId(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={guessSong.isPending}
        >
          {guessSong.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}