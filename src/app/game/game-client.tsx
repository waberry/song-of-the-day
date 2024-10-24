"use client";

import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "~/trpc/react";
import { SongSearch } from "../_components/song-search";

export function GameClient() {
  const { anonymousUserId, isLoading } = useUser();
  const { data: modes } = api.mode.getModes.useQuery();
  const [selectedMode, setSelectedMode] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!anonymousUserId) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Failed to identify user. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Music Guessing Game</CardTitle>
        </CardHeader>
        <CardContent>
          {modes && modes?.length ? (
            <Tabs
              defaultValue={modes[0]?.id.toString()}
              onValueChange={(value) => setSelectedMode(parseInt(value))}
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {modes.map((mode) => (
                  <TabsTrigger key={mode.id} value={mode.id.toString()}>
                    {mode.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {modes.map((mode) => (
                <TabsContent key={mode.id} value={mode.id.toString()}>
                  {selectedMode === mode.id && (
                    <GameMode 
                      modeId={mode.id} 
                      userId={anonymousUserId} 
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-center">No game modes available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// GameMode component will handle individual mode logic
function GameMode({ modeId, userId }: { modeId: number; userId: string }) {
  const { data: songToGuess, isLoading } = api.song.getSongToGuess.useQuery({
    userId,
    modeId,
  });

  const handleSongSelect = (songId: string) => {
    // TODO: Implement guess submission logic
    console.log("Selected song:", songId);
    // Here we'll eventually call your guess submission mutation
  };

  if (isLoading) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Make your guess</h3>
            <SongSearch 
              onSelect={handleSongSelect}
              // TODO  add disabled logic based on game state
              // disabled={gameOver || maxGuessesReached}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Previous Guesses</h3>
            {/* TODO: Add guess history component */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Statistics</h3>
            {/* TODO: Add stats component */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}