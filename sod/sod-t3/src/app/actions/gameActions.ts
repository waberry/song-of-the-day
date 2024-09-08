"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface GameState {
  pickedSongs: any[];
  dailySongFound: boolean;
  guessState: {
    guessedCorrectly: boolean;
    attempts: number;
  };
  lastResetDate: Date;
}

export async function getGameState(anonymousUserId: string): Promise<any> {
  try {
    // Fetch today's start time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    // const tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() + 1); // set to start of tomorrow

    // Fetch the existing game state for today
    // let gameState = await prisma.gameState.findFirst({
    //   where: {
    //     anonymousUserId,
    //     lastResetDate: {
    //       gte: today,
    //       lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    //       // lt: tomorrow
    //     },
    //   },
    // });
    let gameState = null;

    // If no game state exists for today, create a new one
    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          anonymousUserId,
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: today,
        },
      });
    }
    console.log("\n Retrived Game State \n", gameState, "\n");
    return gameState;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.error(
        "Unique constraint violation on anonymousUserId. This should not happen with our current implementation."
      );
    }
    console.error("Detailed error in getGameState:", JSON.stringify(error, null, 2));
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
  retries = 3,
): Promise<any> {
  try {
    // Fetch today's start time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    // Fetch the current game state for today
    let currentGameState = await prisma.gameState.findFirst({
      where: {
        anonymousUserId,
        lastResetDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Start of tomorrow
        },
      },
    });

    if (!currentGameState) {
      // Create a new game state if none exists for today
      currentGameState = await prisma.gameState.create({
        data: {
          anonymousUserId,
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: today,
          ...newState, // Include newState data if necessary
        },
      });
    } else {
      // Check if there's an actual change required
      const isNewDay = currentGameState.lastResetDate.getTime() !== today.getTime();

      if (!isNewDay && Object.keys(newState).length === 0) {
        console.log("No update needed: It's not a new day and the local state is empty.");
        return currentGameState; // Return the current state without making any changes
      }

      // Proceed with the update if necessary
      // Destructure `id` out and gather the rest
      // in data to avoid unique constraint violation
      const { id, ...restCurrentGameState } = currentGameState;
      const { newStateId, ...restNewState } = newState;//ye

      currentGameState = await prisma.gameState.update({
        where: {
          id, // Locate the record by `id`
        },
        data: {
          // Apply changes but ensure that `id` is not included
          ...restNewState,
        },
      });

    }

    return currentGameState;
  } catch (error) {
    if (retries > 0 && error?.code === "08P01") {
      console.log(`Retrying update operation. Attempts left: ${retries - 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
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
