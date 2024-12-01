import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getRandom64BitNumber } from "~/utils";

const prisma = new PrismaClient();

// To put in the Guess Service Layer
enum Comparison {
  Smaller = -1,
  Equal = 0,
  Bigger = 1
}


export const songRouter = createTRPCRouter({
  getSongToGuess: publicProcedure
    .input(
      z.object({
        anonymousUserId: z.string(),
        modeId: z.number(),
        songSpotifyId: z.string()
      })
    ).query(async ({ input }) => {
    console.log('Validated input:', input); // Zod validates the input here
    console.log("coucou2")

    // Check if the mode exists in the mode table
    const mode = await prisma.mode.findUnique({
      where: { id: input.modeId },
    });

    if (!mode) {
      throw new Error('Invalid mode');
    }

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { anonymousUserId: input.anonymousUserId },
    });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          anonymousUserId: input.anonymousUserId,
        },
      });
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Check if there's already an entry in the "day" table for today
    let dayEntry = await prisma.day.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });


    const response = {
      mode: mode, 
      dayEntry: dayEntry
    }

    // If no entry exists, create a new one for today
    if (!dayEntry) {
      console.log("dayEntry doesnt exist yet")
      dayEntry = await prisma.day.create({
        data: {
          date: new Date(),
          seed: getRandom64BitNumber().toString(),
        },
      });
    }

    console.log("returned ",response)


    const todaysUserGuesses = 0

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
   
    // Static comparison for now, we need to compute the comparison correctly when we add the spotify and brainz services
    let detailedComparison = {
      artists: [{name: "Kanye West", success: true}, {name: "Chance The Rapper", success: false}],
      albumName: false,
      duration: Comparison.Bigger,
      years: Comparison.Smaller,
      decades: Comparison.Smaller,
      genres: [{name: "rap", success: true}, {name: "pop", success: false}],
      popularity: Comparison.Bigger,
      countries: [{name: "USA", success: true}, {name: "China", success: false}]
    }
    
    // Store the guess in the database
    const guess = await prisma.guess.create({
      data: {
        userId: user.id,
        date: new Date(),
        modeId: mode.id,
        songSpotifyId: input.songSpotifyId,
        success: true,
        diff: detailedComparison,
      },
    });
    return response

    // return guess;
  }),
});
