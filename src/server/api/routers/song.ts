import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const prisma = new PrismaClient();

export const songRouter = createTRPCRouter({
  getSongToGuess: publicProcedure
  .input(
    z.object({
      userId: z.string(),
      modeId: z.number(),
    })
  ).query(async ({ input }) => {
    console.log('Validated input:', input); // Zod validates the input here
    console.log("coucou2")

    // // Check if the mode exists in the mode table
    // const mode = await prisma.mode.findUnique({
    //   where: { id: modeId },
    // });

    // if (!mode) {
    //   throw new Error('Invalid mode');
    // }
    // return mode;

    // // Check if the user exists
    // let user = await prisma.user.findUnique({
    //   where: { anonymousUserId: userId },
    // });

    // // If the user doesn't exist, create a new one
    // if (!user) {
    //   user = await prisma.user.create({
    //     data: {
    //       anonymousUserId: userId,
    //     },
    //   });
    // }

    // // Get today's date range
    // const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // // Check if there's already an entry in the "day" table for today
    // let dayEntry = await prisma.day.findFirst({
    //   where: {
    //     date: {
    //       gte: startOfDay,
    //       lte: endOfDay,
    //     },
    //   },
    // });

    // // If no entry exists, create a new one for today
    // if (!dayEntry) {
    //   dayEntry = await prisma.day.create({
    //     data: {
    //       date: new Date(),
    //       seed: getRandom64BitNumber(),
    //     },
    //   });
    // }

    // // Count successful guesses for today
    // let todaysUserGuesses = await prisma.guess.count({
    //   where: {
    //     userId: user.id,
    //     date: {
    //       gte: startOfDay,
    //       lte: endOfDay,
    //     },
    //   },
    // });

    // // Get Spotify song IDs from the playlist
    // const songsIDs = await getSpotifyPlaylistTracks(mode.playlistId);
    // const todaysIndexSequence = ShuffleIndexes(dayEntry.seed, songsIDs.length);
    // const songToGuessSpotifyId = songsIDs[todaysIndexSequence[todaysUserGuesses] ?? 0];

    // // Compare the song to guess with the provided song ID
    // const detailedComparison = await compareSongs(songToGuessSpotifyId, songSpotifyId);

    // // Store the guess in the database
    // const guess = await prisma.guess.create({
    //   data: {
    //     userId: user.id,
    //     date: new Date(),
    //     modeId: mode.id,
    //     songSpotifyId: songSpotifyId,
    //     success: songToGuessSpotifyId === songSpotifyId,
    //     diff: detailedComparison,
    //   },
    // });

    // return guess;
  }),
});
