"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "~/server/api/root";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Headphones, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Headphones, Zap } from "lucide-react"

export function Modes() {
  const [modes] = api.mode.getModes.useSuspenseQuery();
  const queryClient = useQueryClient();

  const [playlistId, setPlaylistId] = React.useState("");
  const createMode = api.mode.createMode.useMutation({
    onSettled(
      data: RouterOutputs["mode"]["createMode"] | undefined,
      error: TRPCClientErrorLike<AppRouter> | null,
      variables: { playlistId: string },
      context: unknown
    ) {
      queryClient.invalidateQueries({ queryKey: ['mode.getModes'] });
    }
  });

  return (
    <div className="w-full max-w-xs">
      {modes ? (
        <ul>
          {modes.map((mode) => (
            <li key={mode.id} className="">
              mode name : {mode.name} (Playlist ID: {mode.playlistId}) modeid {mode.id}
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