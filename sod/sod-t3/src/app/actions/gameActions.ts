"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GameState } from "~/types/types";
import { getTrackById, fetchGenresForSong, getSpotifyAccessToken } from "~/server/api/services/spotifyService";
import { getDetailedSongComparison, isCorrectGuess } from '~/utils/gameUtils';


export async function getGameState(anonymousUserId: string, isLocalStorageEmpty: boolean = false): Promise<GameState> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Attempting to find game state");
    
    if (isLocalStorageEmpty) {
      // If localStorage is empty, delete the existing game state (if any)
      await prisma.gameState.deleteMany({
        where: {
          anonymousUserId: anonymousUserId,
        },
      });
      console.log("Deleted existing game state due to empty localStorage");
    }

    let gameState = await prisma.gameState.findFirst({
      where: {
        anonymousUserId: anonymousUserId,
      },
    });

    if (!gameState || isLocalStorageEmpty) {
      console.log("Creating new game state");
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
    } else {
      console.log("Found existing game state");
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
  let currentGameState = null;
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
      console.log("No Current GameState for this user!");
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
      console.log("Updating current GameState!");
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
    console.log("UpdateWithRetry: ", currentGameState);
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
  gameState: GameState
): Promise<GameState> {
  console.log("\n------------Saving New GameState-------------\n")
  try {
    // Get or create today's game state
    const currentGameState = await getGameState(anonymousUserId);

    if (!currentGameState) {
      throw new Error("Game state not found for the provided user ID.");
    }

    // Get the daily song
    const dailySong = await getDailySong();
    if (!dailySong) {
      throw new Error("ERROR: \n Saving GameState: Daily song not found: Could not perfrom comparison\n");
    }
    // Check if a new song was picked
    if (gameState.pickedSongs.length > currentGameState.pickedSongs.length) {
      const newPickedSong = gameState.pickedSongs[0];
      
      // Perform the comparison
      newPickedSong["Genres"] = await fetchGenresForSong(newPickedSong.artists.flatMap(a => a.id).join(","), await getSpotifyAccessToken());
      const comparison = await getDetailedSongComparison(newPickedSong, dailySong);
      
      
      
      // Check if it's the correct guess
      const correct = isCorrectGuess(newPickedSong, dailySong);

      // Update the picked song with comparison results
      newPickedSong.comparison = comparison;
      

      // Update game state
      gameState.dailySongFound = correct || gameState.dailySongFound;
      gameState.guessState = {
        guessedCorrectly: correct || gameState.guessState.guessedCorrectly,
        attempts: gameState.guessState.attempts + 1,
      };

      // Replace the last picked song with the updated version (including comparison and genres)
      gameState.pickedSongs[0] = newPickedSong;
      console.log("saving newly picked! : ", newPickedSong);
    }

    // Update the game state in the database
    const updatedGameState = await updateGameState(anonymousUserId, gameState);

    return updatedGameState;
  } catch (error) {
    console.error("Failed to save game state:", error);
    throw error;
  }
}

export async function getYesterdaySong() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const yesterdaySong = await prisma.dailySong.findFirst({
    where: {
      selectedDate: {
        gte: yesterday,
        lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    select: {
      trackId: true,
    },
  });

  if (!yesterdaySong) {
    return null;
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const spotifyTrack = await getTrackById(yesterdaySong.trackId, accessToken);

    // Format the data to match the YesterdayGuess component props
    return {
      name: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      imageUrl: spotifyTrack.album.images[0]?.url || '',
      albumName: spotifyTrack.album.name,
      duration: spotifyTrack.duration_ms,
      popularity: spotifyTrack.popularity,
      previewUrl: spotifyTrack.preview_url,
      externalUrls: spotifyTrack.external_urls,
      releaseDate: spotifyTrack.album.release_date,
      // Note: Spotify track endpoint doesn't include genres, 
      // you'd need a separate artist request for this
      genres: [],
    };
  } catch (error) {
    console.error("Error fetching track from Spotify:", error);
    return null;
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
  
  return restructureTrack(dailySong);
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
  const updatedPickedSongs = [...gameState.pickedSongs, song];
  return updateGameState(userId, { pickedSongs: updatedPickedSongs });
}

export async function setDailySongFound(userId: string, found: boolean) {
  return updateGameState(userId, { dailySongFound: found });
}

export async function updateGuessState(userId: string, guessState: any) {
  return updateGameState(userId, { guessState });
}
