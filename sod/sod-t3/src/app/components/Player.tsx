"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "./PlayerContext";

interface PlayerProps {
  song: any;
  isFound: boolean;
}

export default function Player({ song, isFound }: PlayerProps) {
  const { accessToken } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Spotify.Player | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializePlayer = useCallback(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onload = () => {
      if (window.Spotify) {
        const player = new window.Spotify.Player({
          name: "Song of the Day Player",
          getOAuthToken: (cb) => cb(accessToken),
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          deviceIdRef.current = device_id;
          setIsReady(true);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
          setIsReady(false);
        });

        player.connect();
        playerRef.current = player;
      }
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [accessToken]);

  useEffect(() => {
    const cleanup = initializePlayer();
    return cleanup;
  }, [initializePlayer]);

  const makeSpotifyRequest = async (
    endpoint: string,
    method: string,
    body?: object,
  ) => {
    if (!accessToken) throw new Error("No access token available");

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Spotify API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  const pausePlayback = async () => {
    try {
      await makeSpotifyRequest("/me/player/pause", "PUT");
      console.log("Pause request successful");
      setIsPlaying(false);
    } catch (error) {
      console.error("Error pausing playback:", error);
    }
  };

  const playTrack = async (trackUri: string, positionMs: number = 0) => {
    if (!isReady || !deviceIdRef.current) {
      console.error("Player not ready or device ID not available");
      return;
    }

    try {
      await makeSpotifyRequest(
        `/me/player/play?device_id=${deviceIdRef.current}`,
        "PUT",
        {
          uris: [trackUri],
          position_ms: positionMs,
        },
      );
      console.log("Play request successful");
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const togglePlay = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!song) return;

    const songUri = song.uri || `spotify:track:${song.id}`;

    if (isPlaying) {
      await pausePlayback();
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    } else {
      if (!isFound) {
        await playTrack(songUri);
        previewTimeoutRef.current = setTimeout(() => {
          pausePlayback();
          console.log("Preview ended");
        }, 2000); // 2 seconds preview
      } else {
        await playTrack(songUri);
      }
    }
  };

  if (!accessToken) {
    return <div className="text-white">Please log in to play music.</div>;
  }

  if (!song) return null;

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-lg bg-gray-800 p-4 shadow-lg">
      <div
        className={`${!isFound ? "blur-sm" : ""} transition-all duration-300`}
      >
        <img
          src={song.album.imageUrl || "https://via.placeholder.com/300"}
          alt={song.name}
          className="mb-4 h-64 w-full rounded-lg object-cover"
        />
        <h2 className="mb-2 truncate text-xl font-bold text-white">
          {song.name}
        </h2>
        <p className="mb-4 truncate text-gray-400">
          {song.artists?.map((a: any) => a.name).join(", ")}
        </p>
      </div>

      {!isFound && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded bg-black bg-opacity-50 p-4 text-lg font-bold text-white">
            {isPlaying
              ? "Playing preview..."
              : "Click play for a 2-second preview"}
          </p>
        </div>
      )}
      <div>
        <button
          onClick={togglePlay}
          className={`relative z-10 w-3/12 origin-center rounded-full p-3 text-white focus:outline-none ${
            isReady
              ? "bg-green-500 hover:bg-green-600"
              : "cursor-not-allowed bg-gray-500"
          }`}
          disabled={!isReady}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
      </div>
    </div>
  );
}
