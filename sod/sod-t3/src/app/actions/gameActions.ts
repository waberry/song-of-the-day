"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


async function getTodaysGameState(anonymousUserId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // set to start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // set to start of tomorrow

  const gameState = await prisma.gameState.findFirst({
    where: {
      anonymousUserId: anonymousUserId,
      lastResetDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  return gameState;
}

export async function getGameState(anonymousUserId: string) {
  try {
    let gameState = await prisma.gameState.findUnique({
      where: { anonymousUserId },
    });

    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          anonymousUserId,
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: new Date(),
        },
      });
    }

    return gameState;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.error(
        "Unique constraint violation on anonymousUserId. This should not happen with our current implementation.",
      );
    }
    // console.error("Error getting or creating game state:", error);
    console.error(
      "Detailed error in getGameState:",
      JSON.stringify(error, null, 2),
    );
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

interface GameState {
  pickedSongs: any[];
  dailySongFound: boolean;
  guessState: {
    guessedCorrectly: boolean;
    attempts: number;
  };
  lastResetDate: Date;
}

async function updateGameStateWithRetry(
  anonymousUserId: string,
  newState: any,
  retries = 3,
) {
  try {
    // Fetch the current game state from the database
    const currentGameState = await prisma.gameState.findUnique({
      where: { anonymousUserId },
    });

    if (!currentGameState) {
      throw new Error("Game state not found for the provided user ID.");
    }

    // Check if it's a new day or if the local state is not empty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNewDay = currentGameState.lastResetDate.getTime() !== today.getTime();

    if (!isNewDay && Object.keys(newState).length === 0) {
      console.log("No update needed: It's not a new day and the local state is empty.");
      return currentGameState; // Return the current state without making any changes
    }

    // Proceed with the update if necessary
    const updatedGameState = await prisma.gameState.update({
      where: { anonymousUserId },
      data: newState,
    });

    return updatedGameState;
  } catch (error) {
    if (retries > 0 && error.code === "08P01") {
      console.log(`Retrying update operation. Attempts left: ${retries - 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      return updateGameStateWithRetry(anonymousUserId, newState, retries - 1);
    }
    throw error;
  }
}

export async function updateGameState(anonymousUserId: string, newState: any) {
  return updateGameStateWithRetry(anonymousUserId, newState);
}

export async function saveGameState(
  anonymousUserId: string,
  gameState: GameState,
) {
  try {
    // Fetch the current game state from the database
    const currentGameState = await getGameState(anonymousUserId);

    if (!currentGameState) {
      throw new Error("Game state not found for the provided user ID.");
    }

    // Check if it's a new day or if the local state is not empty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNewDay = currentGameState.lastResetDate.getTime() !== today.getTime();

    if (!isNewDay && Object.keys(gameState).length === 0) {
      console.log("No update needed: It's not a new day and the local state is empty.");
      return currentGameState; // Return the current state without making any changes
    }

    // If an update is needed, proceed with the update
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
// export async function getDailySong() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   try {
//     // First, try to find an existing DailySong for today
//     let dailySong = await prisma.dailySong.findFirst({
//       where: { selectedDate: today },
//       include: {
//         track: {
//           include: {
//             album: {
//               include: {
//                 images: true,
//               },
//             },
//             artists: {
//               include: {
//                 artist: {
//                   include: {
//                     images: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // If no DailySong exists for today, create a new one
//     if (!dailySong) {
//       // Logic to select a new track goes here
//       const newTrack = await selectNewTrack();

//       dailySong = await prisma.dailySong.create({
//         data: {
//           trackId: newTrack.id,
//           selectedDate: today,
//         },
//         include: {
//           track: {
//             include: {
//               album: {
//                 include: {
//                   images: true,
//                 },
//               },
//               artists: {
//                 include: {
//                   artist: {
//                     include: {
//                       images: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });
//     }

//     if (!dailySong) {
//       console.log("Cannot find or create dailySong");
//       return null;
//     }

//     return restructureTrack(dailySong.track);
//   } catch (error) {
//     console.error("Error in getDailySong:", error);
//     throw error;
//   }
// }

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
