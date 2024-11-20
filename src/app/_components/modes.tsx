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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Headphones className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">Classic Mode</h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Guess the song from a short audio clip. Test your ear for music!
            </p>
            <Button>Play Classic</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Zap className="h-12 w-12 text-yellow-500" />
            <h2 className="text-2xl font-bold">Lightning Round</h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Rapid-fire questions. How many can you answer in 60 seconds?
            </p>
            <Button>Start Lightning Round</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Award className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold">Genre Master</h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Specialized quizzes for different music genres. Prove your expertise!
            </p>
            <Button>Choose Genre</Button>
          </CardContent>
        </Card>
      </div>
  );
} 