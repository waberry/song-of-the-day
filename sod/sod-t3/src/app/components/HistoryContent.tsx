'use client';
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { MdHistory, MdSearch } from "react-icons/md";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { getStoredHistory } from "../actions/historyActions";
// import { useSession } from "next-auth/react";



export default function HistoryContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPlayHistory, setAllPlayHistory] = useState([]);
  const { ref, inView } = useInView();
  // const { data: session, status } = useSession();

  const {
    data: playHistory,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.spotify.getPlayHistory.useInfiniteQuery(
    { limit: 50 },
    {
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        return lastPage[lastPage.length - 1].played_at;
      },
      refetchOnWindowFocus: false,
    },
  );
  // console.log("SESSION HISTORY: ->\n", session.user.id);
  // const storedHistory = getStoredHistory(session.user.id);//anonymousUserId not necessary maybe

  useEffect(() => {
    if (playHistory) {
      setAllPlayHistory(playHistory.pages.flatMap((page) => page ?? []));
    }
  }, [playHistory]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const filteredHistory = allPlayHistory.filter(
    (item) =>
      item.track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.track.artists.some((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tracks or artists"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border p-2 pl-10"
          />
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <ul className="space-y-4">
          {filteredHistory.map((item) => (
            <li
              key={`${item.track.id}-${item.played_at}`}
              className="flex items-center"
            >
              {item.track.album.images && item.track.album.images[1] ? (
                <img
                  src={item.track.album.images[1].url}
                  alt={item.track.name}
                  className="mr-4 h-16 w-16"
                />
              ) : (
                <div className="mr-4 flex h-16 w-16 items-center justify-center bg-gray-200">
                  <MdHistory className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="flex-grow">
                <p className="font-medium">{item.track.name}</p>
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
        {isFetchingNextPage ? (
          <div className="mt-4 text-center">Loading more...</div>
        ) : hasNextPage ? (
          <div ref={ref} className="mt-4 text-center">
            Load More
          </div>
        ) : (
          <div className="mt-4 text-center">No more items to load</div>
        )}
      </div>
    </>
  );
}
