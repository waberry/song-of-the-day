"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GameState } from "~/types/types";
import { api } from "~/trpc/server";
import { fetchArtistInfo, getSpotifyAccessToken } from "~/server/api/services/spotifyService";

// export const getGenres = async (ids: string[]): Promise<string[]> => {
//   try {
//     const genres = await api.spotify.getGenres.useQuery({ ids: ids.join(',') }).data;
//     return removeDuplicates(genres);
//   } catch (error) {
//     console.error('Error fetching genres:', error);
//     return [];
//   }
// };

export const getArtistsInfo = async (ids: string): Promise<any> => {
  try {
    const resp = await fetchArtistInfo(ids, await getSpotifyAccessToken());
    return resp;
  } catch (error) {
    console.error('Error fetching artists infos: ', error);
    return [];
  }
};

export async function getGameState(anonymousUserId: string): Promise<GameState | null> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Attempting to find game state")
    let gameState = await prisma.gameState.findFirst({
      where: {
        anonymousUserId: anonymousUserId,
      },
    });

    console.log("Found game state");

    if (!gameState) {
      console.log("No game state found, creating new one");
      gameState = await prisma.gameState.create({
        data: {
          anonymousUserId,
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: today,
        },
      });
      console.log("Created new game state:", gameState);
    }

    return gameState as GameState;
  } catch (error) {
    console.error("Error in getGameState:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

export async function getCommonGameState() {
  try {
    let commonGameState = await prisma.CommonGameState.findFirst();
    if (!commonGameState) {
      commonGameState = await prisma.CommonGameState.create({
        data: {
          lastResetDate: new Date(),
        },
      });
    }
    return commonGameState;
  } catch (error) {
    console.error("Error fetching or creating common game state:", error);
    throw new Error("Failed to get common game state");
  }
}

async function updateGameStateWithRetry(
  anonymousUserId: string,
  newState: any,
  retries = 3
): Promise<any> {
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
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: today,
          ...newState,
        },
      });
    } else {
      const isNewDay = currentGameState.lastResetDate.getTime() !== today.getTime();

      if (!isNewDay && Object.keys(newState).length === 0) {
        console.log("No update needed: It's not a new day and the local state is empty.");
        return currentGameState;
      }

      // Update the existing record
      currentGameState = await prisma.gameState.update({
        where: { id: currentGameState.id },
        data: {
          ...newState,
          lastResetDate: today,
        },
      });
    }

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


export async function updateGameState(anonymousUserId: string, newState: any) {
  return updateGameStateWithRetry(anonymousUserId, newState);
}

export async function saveGameState(
  anonymousUserId: string,
  gameState: GameState,
): Promise<any> {
  try {
    // Get or create today's game state
    const currentGameState = await getGameState(anonymousUserId);

    if (!currentGameState) {
      throw new Error("Game state not found for the provided user ID.");
    }

    // Check if it's a new day or if the local state is not empty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNewDay = currentGameState.lastResetDate.getTime() !== today.getTime();

    console.log("SAVING STATE --->", gameState);
    if (!isNewDay && Object.keys(gameState).length === 0) {
      console.log("Empty localstorage ! ---!!!!");
      console.log("No update needed: It's not a new day and the local state is empty.");
      return currentGameState; // Return the current state without making changes
    }

    const updatedGameState = await updateGameState(anonymousUserId, gameState);

    return updatedGameState;
  } catch (error) {
    console.error("Failed to save game state:", error);
    throw error;
  }
}

export async function getDailySong() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailySong = await prisma.dailySong.findFirst({
    where: { selectedDate: today },
    include: {
      track: {
        include: {
          album: {
            include: {
              images: true,
            },
          },
          artists: {
            include: {
              artist: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!dailySong) {
    console.log("Cannot find dailySong: ", dailySong);
    return null;
  }
  
  return restructureTrack(dailySong.track);
}

function restructureTrack(track) {
  return {
    ...track,
    duration_ms: track.duration,
    preview_url: track.previewUrl,
    external_urls: { spotify: track.spotifyUrl },
    uri: `spotify:track:${track.id}`,
    album: {
      ...track.album,
      images: track.album.images.map((img) => ({
        url: img.url,
        height: img.height,
        width: img.width,
      })),
      imageUrl: track.album.imageUrl,
      external_urls: { spotify: track.album.spotifyUrl },
    },
    artists: track.artists.map((ta) => ({
      ...ta.artist,
      external_urls: { spotify: ta.artist.spotifyUrl },
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
  const updatedPickedSongs = [...gameState.pickedSongs, song];
  return updateGameState(userId, { pickedSongs: updatedPickedSongs });
}

export async function setDailySongFound(userId: string, found: boolean) {
  return updateGameState(userId, { dailySongFound: found });
}

export async function updateGuessState(userId: string, guessState: any) {
  return updateGameState(userId, { guessState });
}
