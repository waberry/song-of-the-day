"use client";

import { useEffect } from "react";
import { useUser } from "~/hooks/useUser";
import { useGameState } from "~/hooks/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api as trpc } from "~/trpc/react";
import { SongSearch } from "../_components/song-search";

export function GameClient() {
  const { anonymousUserId, isLoading: userLoading } = useUser();
  const { data: modes } = trpc.mode.getModes.useQuery();
  const { currentMode, setMode } = useGameState();

  if (userLoading) {
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
          {modes?.length ? (
            <Tabs
              defaultValue={modes[0]?.id.toString()}
              onValueChange={(value) => {
                const mode = modes.find(m => m.id.toString() === value);
                if (mode) setMode(mode);
              }}
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
                  {currentMode?.id === mode.id && (
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

function GameMode({ modeId, userId }: { modeId: number; userId: string }) {
  const { 
    progress,
    status,
    canGuess,
    startGame,
    makeGuess,
    currentMode
  } = useGameState();
  
  const { data: songToGuess, isLoading } = trpc.song.getSongToGuess.useQuery({
    userId,
    modeId,
  });

  useEffect(() => {
    if (songToGuess && currentMode) {
      startGame(currentMode, songToGuess);
    }
  }, [songToGuess, currentMode, startGame]);

  const handleSongSelect = async (songId: string) => {
    // TODO: Get song details from Spotify
    const songDetails = { id: songId, name: "Test Song", artist: "Test Artist" };
    
    makeGuess({
      songId,
      songName: songDetails.name,
      artistName: songDetails.artist,
      isCorrect: songId === progress?.songToGuess?.id,
      diff: {
        // TODO: Implement proper diff logic
        artist: false,
        title: false,
      },
    });
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
              disabled={!canGuess}
            />
            {!canGuess && status === 'won' && (
              <p className="text-green-500 mt-2">You won! Come back tomorrow for a new song.</p>
            )}
            {!canGuess && status === 'lost' && (
              <p className="text-red-500 mt-2">Game over. Try again tomorrow!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Previous Guesses</h3>
            {progress?.guesses.map((guess, index) => (
              <div key={index} className="py-2">
                {guess.songName} - {guess.artistName}
                {/* TODO: Add proper guess visualization */}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Statistics</h3>
            <p>Attempts: {progress?.attempts || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}