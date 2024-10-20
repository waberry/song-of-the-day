"use client";
import { useMemo } from "react";
import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "~/app/_trpc/Provider";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GenreBreakdown = () => {
  const { data: topTracks, isLoading: isLoadingTracks } = api.spotify.getTopTracks.useQuery(undefined, useHandleUnauthorized);
  const { data: topArtists, isLoading: isLoadingArtists } = api.spotify.getTopArtists.useQuery(undefined, useHandleUnauthorized);

  const allDataFetched = useMemo(() => {
    return (topTracks || []).concat(topArtists || []);
  }, [topTracks, topArtists]);

  const genreData = useMemo(() => {
    if (isLoadingTracks || isLoadingArtists) {
      return { labels: [], datasets: [] };
    }

    const genres = allDataFetched
      .flatMap(item => item.genres || [])
      .reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});

    const sortedGenres = Object.entries(genres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedGenres.map(([genre]) => genre),
      datasets: [{
        label: 'Count',
        data: sortedGenres.map(([, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 20,
        borderSkipped: false,
      }],
    };
  }, [allDataFetched, isLoadingTracks, isLoadingArtists]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (isLoadingTracks || isLoadingArtists) {
    return <div>Loading genre breakdown...</div>;
  }

  return <Bar data={genreData} options={options} />;
};

export default GenreBreakdown;
