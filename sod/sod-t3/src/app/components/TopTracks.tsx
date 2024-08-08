"use client";
import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "~/app/_trpc/Provider";

const TopTracks = () => {
  const handleUnauthorized = useHandleUnauthorized();
  const {
    data: topTracks,
    isLoading,
    error,
  } = api.spotify.getTopTracks.useQuery(
    { limit: 50 }, // Request 50 tracks
    {
      ...handleUnauthorized,
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    },
  );

  if (isLoading) return <div>Loading top tracks...</div>;
  if (error) return <div>Error loading top tracks</div>;

  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto">
      {topTracks.slice(0, 50).map(
        (
          track,
          index, // Display up to 50 tracks
        ) => (
          <li key={track.id} className="flex items-center">
            <span className="mr-2 text-sm font-semibold text-gray-500">
              {index + 1}
            </span>
            <img
              src={
                track.album.images?.[2]?.url || "https://via.placeholder.com/40"
              }
              alt={track.name}
              className="mr-3 h-10 w-10 rounded"
            />
            <div className="overflow-hidden">
              <p className="truncate font-medium">{track.name}</p>
              <p className="truncate text-sm text-gray-600">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </li>
        ),
      )}
    </ul>
  );
};

export default TopTracks;
