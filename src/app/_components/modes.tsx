"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "~/trpc/react";

export function Modes() {
  const [modes] = api.mode.getModes.useSuspenseQuery();
  const queryClient = useQueryClient(); // Initialize the query client

  const [playlistId, setPlaylistId] = useState("");
  const createMode = api.mode.createMode.useMutation({
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries('getModes'); // Invalidate the query
    }
  });

  return (
    <div className="w-full max-w-xs">
      {modes ? (
        <ul>
          {modes.map((mode) => (
            <li key={mode.id} className="truncate">
              {mode.name} (Playlist ID: {mode.playlistId})
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no modes</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMode.mutate({ playlistId: playlistId });
        }}
        className="flex flex-col gap-2"
      >
                <input
          type="text"
          placeholder="Playlist ID"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createMode.isPending}
        >
          {createMode.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
