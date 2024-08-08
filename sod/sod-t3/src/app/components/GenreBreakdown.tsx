"use client";

import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "~/app/_trpc/Provider";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GenreBreakdown = () => {
  // const handleUnauthorized = useHandleUnauthorized();
  const { data: topTracks, isLoading: isLoadingTracks } =
    api.spotify.getTopTracks.useQuery(undefined, useHandleUnauthorized);
  const { data: topArtists, isLoading: isLoadingArtists } =
    api.spotify.getTopArtists.useQuery(undefined, useHandleUnauthorized);

  if (isLoadingTracks || isLoadingArtists)
    return <div>Loading genre breakdown...</div>;

  const genres = [...(topTracks || []), ...(topArtists || [])]
    .flatMap((item) => item.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  const topGenres = Object.entries(genres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const data = {
    labels: topGenres.map(([genre]) => genre),
    datasets: [
      {
        data: topGenres.map(([, count]) => count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default GenreBreakdown;
