"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
    console.error("Error getting or creating game state:", error);
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

export async function updateGameState(anonymousUserId: string, newState: any) {
  const updatedGameState = await prisma.gameState.update({
    where: { anonymousUserId },
    data: newState,
  });
  return updatedGameState;
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

export async function saveGameState(
  anonymousUserId: string,
  gameState: GameState,
) {
  try {
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
