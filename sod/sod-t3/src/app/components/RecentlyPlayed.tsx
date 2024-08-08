"use client";

import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "../_trpc/Provider";
import { useRouter } from "next/navigation";

const RecentlyPlayed = () => {
  // const handleUnauthorized = useHandleUnauthorized();
  const router = useRouter();

  const {
    data: recentlyPlayed,
    isLoading,
    error,
  } = api.spotify.getRecentlyPlayed.useQuery(undefined, {
    ...useHandleUnauthorized,
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div>Loading recently played...</div>;
  if (error) return <div>Error loading recently played tracks</div>;

  const handleClick = () => {
    router.push("/history");
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {recentlyPlayed.slice(0, 5).map((item, index) => (
          <li
            key={`${item.track.id}-${item.played_at}`}
            className="flex items-center"
          >
            <img
              src={
                item.track.album.images?.[2]?.url ||
                "https://via.placeholder.com/40"
              }
              alt={item.track.name}
              className="mr-3 h-10 w-10 rounded"
            />
            <div className="overflow-hidden">
              <p className="truncate font-medium">{item.track.name}</p>
              <p className="truncate text-sm text-gray-600">
                {item.track.artists.map((artist) => artist.name).join(", ")}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.played_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 text-center text-sm text-blue-500">
        View Full History
      </div>
    </div>
  );
};

export default RecentlyPlayed;
