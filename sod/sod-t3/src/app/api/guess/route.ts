// app/api/gameState/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { getRandom64BitNumber, ShuffleIndexes } from '~/utils/random';
import { getSpotifyPlaylistTracks, getTrackById } from '~/server/api/services/spotifyService';
import { getDetailedSongComparison } from '~/utils/gameUtils';


const prisma = new PrismaClient();


async function compareSongs(song1SpotifyID: string, song2SpotifyID:string) {
    const song1 = await getTrackById(song1SpotifyID);
    const song2 = await getTrackById(song2SpotifyID);

    // compare the songs and return the result
    return getDetailedSongComparison(song1, song2);

}


export async function POST(request: Request) {

    // this route gets data from the post request
    const data = await request.json();

    // validate the data with this schema : { userId: 124, modeId: 1, songSpotifyId: '1234'}
    if (!data.userId || !data.modeId || !data.songSpotifyId) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // check if data.modeId exists in the mode table
    const mode = await prisma.mode.findUnique({
        where: {
            id: data.modeId,
        },
    });

    // if not, return an error
    if (!mode) {
        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // check if user exists, 
    let user = await prisma.user.findUnique({
        where: {
            anonymousUserId: data.userId,
        },
    });

    // if user not exist, create a new user
    if (!user) {
        user = await prisma.user.create({
            data: {
                anonymousUserId: data.userId,
            },
        });
    }
  
    // check if in day table there's a row with today's date
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let dayEntry = await prisma.day.findFirst({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    if (!dayEntry) {
        // create a new entry for today's date
        dayEntry = await prisma.day.create({
            data: {
                date: new Date(),
                seed: getRandom64BitNumber(),
            },
        });
    }

    // count how many succesfull guesses 
    let todaysUserGuesses = 0;
    todaysUserGuesses = await prisma.guess.count({
        where: {
            userId: user.id,
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    })
    
    // get list of all spotifysong IDs using this : getSpotifyPlaylistTracks
    const songsIDs = await getSpotifyPlaylistTracks(mode.playlistId);
    const todaysIndexSequence = ShuffleIndexes(dayEntry.seed, songsIDs.length);
    const songToGuessSpotifyId = songsIDs[todaysIndexSequence[todaysUserGuesses] ?? 0];


    // compare songToGuessSpotifyId with data.songSpotifyId 
    const detailedComparison = await compareSongs(songToGuessSpotifyId, data.songSpotifyId);

    // store guess in the guess table
    const guess = await prisma.guess.create({
        data: {
            userId: user.id,
            date: new Date(),
            modeId: mode.id,
            songSpotifyId: data.songSpotifyId,
            success: songToGuessSpotifyId === data.songSpotifyId,
            diff: detailedComparison
        },
    });

  return NextResponse.json(guess);
}
