"use client";
import { api } from "~/trpc/react";
import {
  FaUser,
  FaEnvelope,
  FaSpotify,
  FaUsers,
  FaChartBar,
  FaHistory,
} from "react-icons/fa";
import { MdAudiotrack } from "react-icons/md";
import GenreBreakdown from "../components/genreBreakdown";
import PlayHistory from "../components/playHistory";
import { useHandleUnauthorized } from "~/app/_trpc/Provider";
import LoadingScreen from "../components/loadingScreen";
import ErrorDisplay from "../components/ErrorDisplay";
import { useSession } from "next-auth/react";
import UserProfile from "../components/userProfile";

const DashboardCard = ({ title, icon, children, error, retry }) => (
  <div className="rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    {error ? (
      <ErrorDisplay
        message={`Failed to load ${title.toLowerCase()}`}
        retry={retry}
      />
    ) : (
      children
    )}
  </div>
);

export default function Dashboard() {
  const { status } = useSession();
  const handleUnauthorized = useHandleUnauthorized();

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = api.spotify.getUserProfile.useQuery(undefined, {
    enabled: status === "authenticated",
    ...handleUnauthorized,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("rate limit exceeded")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const {
    data: topArtists,
    isLoading: isLoadingTopArtists,
    error: topArtistsError,
    refetch: refetchTopArtists,
  } = api.spotify.getTopArtists.useQuery(undefined, {
    enabled: status === "authenticated",
    ...handleUnauthorized,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const {
    data: topTracks,
    isLoading: isLoadingTopTracks,
    error: topTracksError,
    refetch: refetchTopTracks,
  } = api.spotify.getTopTracks.useQuery(undefined, {
    enabled: status === "authenticated",
    ...handleUnauthorized,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("rate limit exceeded")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const {
    data: recentlyPlayed,
    isLoading: isLoadingRecentlyPlayed,
    error: recentlyPlayedError,
    refetch: refetchRecentlyPlayed,
  } = api.spotify.getRecentlyPlayed.useQuery(undefined, {
    enabled: status === "authenticated",
    ...handleUnauthorized,
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("rate limit exceeded")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const isLoading =
    isLoadingProfile || isLoadingTopTracks || isLoadingRecentlyPlayed;

  if (status === "loading" || isLoading) {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please sign in to view your Spotify dashboard.
          </p>
          <button className="mt-6 rounded-full bg-green-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-600">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800">
          Your Spotify Insights
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <UserProfile></UserProfile>

          <DashboardCard
            title="Genre Breakdown"
            icon={<FaChartBar className="text-2xl text-green-500" />}
            error={topTracksError || topArtistsError}
            retry={() => {
              refetchTopTracks();
              refetchTopArtists();
            }}
          >
            {topTracks && topArtists && (
              <GenreBreakdown topTracks={topTracks} topArtists={topArtists} />
            )}
          </DashboardCard>

          <DashboardCard
            title="Top Tracks"
            icon={<MdAudiotrack className="text-2xl text-red-500" />}
            error={topTracksError}
            retry={() => refetchTopTracks()}
          >
            {topTracks && (
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {topTracks.slice(0, 10).map((track, index) => (
                  <li key={track.id} className="flex items-center">
                    <span className="mr-2 text-sm font-semibold text-gray-500">
                      {index + 1}
                    </span>
                    <img
                      src={
                        track.album.images?.[2]?.url ||
                        "https://via.placeholder.com/40"
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
                ))}
              </ul>
            )}
          </DashboardCard>

          <DashboardCard
            title="Recently Played"
            icon={<FaHistory className="text-2xl text-purple-500" />}
            error={recentlyPlayedError}
            retry={() => refetchRecentlyPlayed()}
          >
            {recentlyPlayed && (
              <PlayHistory
                tracks={recentlyPlayed}
                isLoading={isLoadingRecentlyPlayed}
              />
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
