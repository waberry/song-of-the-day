import axios from "axios";
import { refreshAccessToken } from "../routers/authservice";
import { spotifyUserType } from "~/types/spotify.types";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const getSpotifyAccessToken = async (): Promise<string> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

export const searchSpotifyTracks = async (
  accessToken: string,
  searchTerm: string,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.tracks.items;
};

export const getTopTracks = async (
  accessToken: string,
  limit: number = 50,
  timeRange: string = "medium_term",
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get unique artist IDs
  const artistIds = [
    ...new Set(
      data.items.flatMap((track) => track.artists.map((artist) => artist.id)),
    ),
  ];

  // Split artist IDs into chunks of 50
  const artistIdChunks = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    artistIdChunks.push(artistIds.slice(i, i + 50));
  }

  // Fetch artist details in batches
  const artistsData = [];
  for (const chunk of artistIdChunks) {
    const artistsResponse = await fetch(
      `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const chunkData = await artistsResponse.json();
    artistsData.push(...chunkData.artists);
  }

  // Map artist genres to tracks
  const artistGenres = Object.fromEntries(
    artistsData.map((artist) => [artist.id, artist.genres]),
  );

  return data.items.map((track) => ({
    ...track,
    artists: track.artists.map((artist) => ({
      ...artist,
      genres: artistGenres[artist.id] || [],
    })),
  }));
};

export const getRecentlyPlayed = async (
  accessToken: string,
  limit: number = 20,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.items;
};

export const getUserSpotifyData = async (
  accessToken: string,
  refreshToken: string,
): Promise<SpotifyUserProfile> => {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      console.log("Token is invalid or has expired. Attempting to refresh...");
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        // Retry the request with the new token
        return getUserSpotifyData(newAccessToken, refreshToken);
      } catch (refreshError) {
        throw new Error(
          "Failed to refresh token. User needs to re-authenticate.",
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`,
      );
    }

    const userData: SpotifyUserProfile = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user Spotify data:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

// Define the type for the Spotify user profile
interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  // Add other fields as needed
}
export const getUserProfile = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    const userData = await getUserSpotifyData(accessToken, refreshToken);
    return userData;
  } catch (error) {
    if (
      error.message.includes("Failed to refresh token") ||
      error.message.includes("User needs to re-authenticate")
    ) {
      // Token refresh failed or user needs to re-authenticate
      // You might want to throw a specific error or return a special value to indicate this
      throw new Error("Authentication required");
    } else {
      // Handle other types of errors
      console.error("Error fetching user profile:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
};

export const getPlayHistory = async (
  accessToken: string,
  limit: number = 50,
  cursor?: string,
) => {
  let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
  if (cursor) {
    url += `&before=${cursor}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.items;
};

// export async function getPopularTracks(
//   accessToken: string,
//   limit: number = 50,
// ) {
//   const response = await fetch(
//     `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=${limit}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await response.json();
//   return data.items.map((item: any) => item.track);
// }

export async function getPopularTracks(
  accessToken: string,
  limit: number = 50,
) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.items.map((item: any) => item.track);
  } catch (error) {
    console.error("Error fetching popular tracks:", error);
    throw error;
  }
}

export const getTopArtists = async (
  accessToken: string,
  limit: number = 20,
  timeRange: string = "medium_term",
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.items;
};

export const getSavedTracks = async (
  accessToken: string,
  limit: number = 20,
  offset: number = 0,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.items;
};

export const getSavedAlbums = async (
  accessToken: string,
  limit: number = 20,
  offset: number = 0,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.items;
};

export const getUserPlaylists = async (
  accessToken: string,
  limit: number = 20,
  offset: number = 0,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.items;
};

export const getAudioFeaturesForTracks = async (
  accessToken: string,
  trackIds: string[],
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.audio_features;
};

export const getNewReleases = async (
  accessToken: string,
  limit: number = 20,
  offset: number = 0,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.albums.items;
};

export const getFollowedArtists = async (
  accessToken: string,
  limit: number = 20,
  after?: string,
) => {
  let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;
  if (after) {
    url += `&after=${after}`;
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.artists.items;
};

export const getAvailableGenreSeeds = async (accessToken: string) => {
  const response = await fetch(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.genres;
};

export const getRecommendations = async (
  accessToken: string,
  options: {
    seedArtists?: string[];
    seedGenres?: string[];
    seedTracks?: string[];
    limit?: number;
  },
) => {
  const params = new URLSearchParams({
    limit: options.limit?.toString() || "20",
    seed_artists: options.seedArtists?.join(",") || "",
    seed_genres: options.seedGenres?.join(",") || "",
    seed_tracks: options.seedTracks?.join(",") || "",
  });
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data.tracks;
};

export const getCurrentlyPlaying = async (accessToken: string) => {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (response.status === 204) {
    return null; // No track currently playing
  }
  const data = await response.json();
  return data;
};

export const getDevices = async (accessToken: string) => {
  const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.devices;
};

export const getTrackAnalysis = async (
  accessToken: string,
  trackId: string,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-analysis/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data;
};
