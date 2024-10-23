'use client';

import { api } from "~/trpc/react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestPage() {
  const [anonymousUserId, setAnonymousUserId] = useState("test-user");
  const [playlistId, setPlaylistId] = useState("");
  const [songInputs, setSongInputs] = useState({
    userId: "",
    modeId: 1,
  });

  // Queries
  const hello = api.player.hello.useQuery({ text: "hello world" });
  const modes = api.mode.getModes.useQuery();
  const songToGuess = api.song.getSongToGuess.useQuery(songInputs);

  // Mutations
  const playerData = api.player.get.useMutation();
  const createMode = api.mode.createMode.useMutation();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">tRPC API Explorer</h1>

      <Tabs defaultValue="queries" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="mutations">Mutations</TabsTrigger>
        </TabsList>

        <TabsContent value="queries">
          <div className="grid gap-6">
            {/* Player Hello Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>player.hello</span>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                    query
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2">Response:</p>
                    {hello.isLoading ? (
                      <div className="animate-pulse h-4 bg-muted-foreground/20 rounded w-24" />
                    ) : hello.error ? (
                      <div className="text-destructive">{hello.error.message}</div>
                    ) : (
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(hello.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Modes Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>mode.getModes</span>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                    query
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2">Response:</p>
                    {modes.isLoading ? (
                      <div className="animate-pulse h-4 bg-muted-foreground/20 rounded w-24" />
                    ) : modes.error ? (
                      <div className="text-destructive">{modes.error.message}</div>
                    ) : (
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(modes.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Song To Guess Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>song.getSongToGuess</span>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                    query
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">User ID</label>
                      <input
                        type="text"
                        value={songInputs.userId}
                        onChange={(e) => setSongInputs(prev => ({ ...prev, userId: e.target.value }))}
                        className="w-full p-2 border rounded-md mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mode ID</label>
                      <input
                        type="number"
                        value={songInputs.modeId}
                        onChange={(e) => setSongInputs(prev => ({ ...prev, modeId: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded-md mt-1"
                      />
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2">Response:</p>
                    {songToGuess.isLoading ? (
                      <div className="animate-pulse h-4 bg-muted-foreground/20 rounded w-24" />
                    ) : songToGuess.error ? (
                      <div className="text-destructive">{songToGuess.error.message}</div>
                    ) : (
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(songToGuess.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mutations">
          <div className="grid gap-6">
            {/* Player Get Mutation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>player.get</span>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                    mutation
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      anonymousUserId
                    </label>
                    <input
                      type="text"
                      value={anonymousUserId}
                      onChange={(e) => setAnonymousUserId(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <button
                    onClick={() => playerData.mutate({ anonymousUserId })}
                    disabled={playerData.isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {playerData.isLoading ? 'Running...' : 'Run Mutation'}
                  </button>

                  {playerData.data && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-mono mb-2">Response:</p>
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(playerData.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Mode Mutation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>mode.createMode</span>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                    mutation
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      playlistId
                    </label>
                    <input
                      type="text"
                      value={playlistId}
                      onChange={(e) => setPlaylistId(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <button
                    onClick={() => createMode.mutate({ playlistId })}
                    disabled={createMode.isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {createMode.isLoading ? 'Creating...' : 'Create Mode'}
                  </button>

                  {createMode.data && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-mono mb-2">Response:</p>
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(createMode.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}