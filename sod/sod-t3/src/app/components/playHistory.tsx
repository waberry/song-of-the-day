// components/PlayHistory.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MdHistory, MdSearch } from "react-icons/md";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  played_at: string;
}

interface PlayHistoryProps {
  tracks: Track[];
  isLoading: boolean;
}

export default function PlayHistory({ tracks, isLoading }: PlayHistoryProps) {
  if (isLoading) {
    return <p>Loading play history...</p>;
  }

  if (!tracks || tracks.length === 0) {
    return <p>No play history available</p>;
  }
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Play History</h2>
        <Link
          href="/history"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <MdSearch className="mr-1" />
          Search Full History
        </Link>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {tracks.map((item) => (
            <li
              key={`${item.track.id}-${item.played_at}`}
              className="flex items-center"
            >
              {item.track.album.images && item.track.album.images[2] ? (
                <img
                  src={item.track.album.images[2].url}
                  alt={item.track.name}
                  className="mr-2 h-10 w-10"
                />
              ) : (
                <div className="mr-2 flex h-10 w-10 items-center justify-center bg-gray-200">
                  <MdHistory className="text-gray-400" />
                </div>
              )}
              <div className="flex-grow">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(item.played_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
