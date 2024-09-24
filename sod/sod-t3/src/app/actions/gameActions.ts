"use server";

import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GameState } from "~/types/types";
import { getTrackById, fetchGenresForSong, getSpotifyAccessToken } from "~/server/api/services/spotifyService";
import { getDetailedSongComparison, isCorrectGuess } from '~/utils/gameUtils';

<<<<<<< Updated upstream
// Helper functions for localStorage
const getFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

const setInStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export async function getGameState(anonymousUserId: string, isLocalStorageEmpty: boolean = false): Promise<GameState> {
=======
interface GameState {
  pickedSongs: any[]; // Consider using a more specific type
  dailySongFound: boolean;
  guessState: {
    guessedCorrectly: boolean;
    attempts: number;
  };
  lastResetDate: Date;
}

export async function getGameState(anonymousUserId: string): Promise<GameState | null> {
>>>>>>> Stashed changes
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

<<<<<<< Updated upstream
    // Check localStorage first
    const storageKey = `gameState_${anonymousUserId}`;
    let gameState = getFromStorage(storageKey);

    if (gameState && !isLocalStorageEmpty && new Date(gameState.lastResetDate).toDateString() === today.toDateString()) {
      return gameState as GameState;
    }

    // If not in localStorage or needs reset, check database
    if (isLocalStorageEmpty) {
      await prisma.gameState.deleteMany({ where: { anonymousUserId } });
    }

    gameState = await prisma.gameState.findFirst({ where: { anonymousUserId } });

    if (!gameState || isLocalStorageEmpty) {
      gameState = await prisma.gameState.create({
        data: {
=======
    const gameState = await prisma.gameState.findUnique({
      where: {
        anonymousUserId_lastResetDate: {
>>>>>>> Stashed changes
          anonymousUserId,
          lastResetDate: today,
        },
      },
    });

    if (!gameState) {
      return null;
    }

<<<<<<< Updated upstream
    // Update localStorage
    setInStorage(storageKey, gameState);

    return gameState as GameState;
  } catch (error) {
    console.error("Error in getGameState:", error);
=======
    console.log("\n Retrieved Game State \n", gameState, "\n");
    return gameState as GameState;
  } catch (error) {
    console.error("Detailed error in getGameState:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
>>>>>>> Stashed changes
    throw error;
  }
}

export async function getCommonGameState() {
  try {
    const storageKey = 'commonGameState';
    let commonGameState = getFromStorage(storageKey);

    if (!commonGameState) {
      commonGameState = await prisma.CommonGameState.findFirst() || 
        await prisma.CommonGameState.create({ data: { lastResetDate: new Date() } });
      setInStorage(storageKey, commonGameState);
    }

    return commonGameState;
  } catch (error) {
    console.error("Error fetching or creating common game state:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    throw new Error("Failed to get common game state");
  }
}

<<<<<<< Updated upstream
async function updateGameStateWithRetry(
  anonymousUserId: string,
  newState: Partial<GameState>,
  retries = 3
): Promise<GameState> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentGameState = await prisma.gameState.findFirst({
      where: {
        anonymousUserId,
        lastResetDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!currentGameState) {
      currentGameState = await prisma.gameState.create({
        data: {
          anonymousUserId,
          pickedSongs: newState.pickedSongs || [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: today,
          ...newState,
        },
      });
    } else {
      currentGameState = await prisma.gameState.update({
        where: { id: currentGameState.id },
        data: {
          ...newState,
          lastResetDate: today,
        },
      });
    }

    // Update localStorage
    setInStorage(`gameState_${anonymousUserId}`, currentGameState);

    return currentGameState;
  } catch (error) {
    if (retries > 0 && error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log(`Retrying update operation. Attempts left: ${retries - 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateGameStateWithRetry(anonymousUserId, newState, retries - 1);
    }
    console.error("Error in updateGameStateWithRetry:", error);
    throw error;
  }
}

export async function updateGameState(anonymousUserId: string, newState: Partial<GameState>) {
  return updateGameStateWithRetry(anonymousUserId, newState);
}

export async function saveGameState(
  anonymousUserId: string,
  gameState: GameState
): Promise<GameState> {
  try {
    const currentGameState = await getGameState(anonymousUserId);
    const dailySong = await getDailySong();

    if (!dailySong) {
      throw new Error("Daily song not found: Could not perform comparison");
    }

    if (gameState.pickedSongs.length > currentGameState.pickedSongs.length) {
      const newPickedSong = gameState.pickedSongs[0];
      
      newPickedSong["Genres"] = await fetchGenresForSong(newPickedSong.artists.flatMap(a => a.id).join(","), await getSpotifyAccessToken());
      const comparison = await getDetailedSongComparison(newPickedSong, dailySong);
      
      const correct = isCorrectGuess(newPickedSong, dailySong);

      newPickedSong.comparison = comparison;

      gameState.dailySongFound = correct || gameState.dailySongFound;
      gameState.guessState = {
        guessedCorrectly: correct || gameState.guessState.guessedCorrectly,
        attempts: gameState.guessState.attempts + 1,
      };

      gameState.pickedSongs[0] = newPickedSong;
    }

    return updateGameState(anonymousUserId, gameState);
=======
export async function saveGameState(
  anonymousUserId: string,
  gameState: GameState,
): Promise<GameState> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedGameState = await prisma.gameState.upsert({
      where: {
        anonymousUserId_lastResetDate: {
          anonymousUserId,
          lastResetDate: today,
        },
      },
      update: {
        ...gameState,
        lastResetDate: today,
      },
      create: {
        anonymousUserId,
        ...gameState,
        lastResetDate: today,
      },
    });

    console.log("SAVING STATE --->", updatedGameState);
    return updatedGameState as GameState;
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Failed to save game state:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    throw error;
  }
}

export async function getYesterdaySong() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const storageKey = 'yesterdaySong';
  let yesterdaySong = getFromStorage(storageKey);

  if (!yesterdaySong) {
    const dbYesterdaySong = await prisma.dailySong.findFirst({
      where: {
        selectedDate: {
          gte: yesterday,
          lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: { trackId: true },
    });

    if (dbYesterdaySong) {
      try {
        const accessToken = await getSpotifyAccessToken();
        const spotifyTrack = await getTrackById(dbYesterdaySong.trackId, accessToken);

        yesterdaySong = {
          name: spotifyTrack.name,
          artist: spotifyTrack.artists[0].name,
          imageUrl: spotifyTrack.album.images[0]?.url || '',
          albumName: spotifyTrack.album.name,
          duration: spotifyTrack.duration_ms,
          popularity: spotifyTrack.popularity,
          previewUrl: spotifyTrack.preview_url,
          externalUrls: spotifyTrack.external_urls,
          releaseDate: spotifyTrack.album.release_date,
          genres: [],
        };

        setInStorage(storageKey, yesterdaySong);
      } catch (error) {
        console.error("Error fetching track from Spotify:", error);
        return null;
      }
    }
  }

  return yesterdaySong;
}

export async function getDailySong() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const storageKey = 'dailySong';
  let dailySong = getFromStorage(storageKey);

  if (!dailySong) {
    dailySong = await prisma.dailySong.findFirst({
      where: { selectedDate: today },
      include: {
        track: {
          include: {
            album: { include: { images: true } },
            artists: { include: { artist: { include: { images: true } } } },
          },
        },
      },
    });

    if (dailySong) {
      dailySong = restructureTrack(dailySong);
      setInStorage(storageKey, dailySong);
    }
  }

  return dailySong;
}

function restructureTrack(dailySong) {
  let track = dailySong.track;
  return {
    ...track,
    duration_ms: track.duration_ms,
    preview_url: track.previewUrl,
    external_urls: { spotify: track.external_urls },
    uri: `spotify:track:${track.id}`,
    genres: dailySong.genres,
    album: {
      ...track.album,
      images: track.album.images.map((img) => ({
        url: img.url,
        height: img.height,
        width: img.width,
      })),
      imageUrl: track.album.imageUrl,
      external_urls: { spotify: track.album.external_urls },
    },
    artists: track.artists.map((ta) => ({
      ...ta.artist,
      external_urls: { spotify: ta.artist.external_urls },
      images: ta.artist.images.map((img) => ({
        url: img.url,
        height: img.height,
        width: img.width,
      })),
    })),
  };
}

export async function addPickedSong(userId: string, song: any) {
  const gameState = await getGameState(userId);
<<<<<<< Updated upstream
  const updatedPickedSongs = [song, ...gameState.pickedSongs];
  return updateGameState(userId, { pickedSongs: updatedPickedSongs });
=======
  if (!gameState) {
    throw new Error("Game state not found for the provided user ID.");
  }
  const updatedPickedSongs = [...gameState.pickedSongs, song];
  return saveGameState(userId, { ...gameState, pickedSongs: updatedPickedSongs });
>>>>>>> Stashed changes
}

export async function setDailySongFound(userId: string, found: boolean) {
  const gameState = await getGameState(userId);
  if (!gameState) {
    throw new Error("Game state not found for the provided user ID.");
  }
  return saveGameState(userId, { ...gameState, dailySongFound: found });
}

export async function updateGuessState(userId: string, guessState: any) {
<<<<<<< Updated upstream
  return updateGameState(userId, { guessState });
=======
  const gameState = await getGameState(userId);
  if (!gameState) {
    throw new Error("Game state not found for the provided user ID.");
  }
  return saveGameState(userId, { ...gameState, guessState });
>>>>>>> Stashed changes
}