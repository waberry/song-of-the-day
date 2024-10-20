// app/api/gameState/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const spotifyId = // get spotifyId from session or request
  const user = await prisma.user.findUnique({
    where: { spotifyId },
    include: { gameState: true },
  });

  if (!user || !user.gameState) {
    // Create new game state if it doesn't exist
    const newGameState = await prisma.gameState.create({
      data: {
        user: { connect: { spotifyId } },
        pickedSongs: [],
        dailySongFound: false,
        guessState: { guessedCorrectly: false, attempts: 0 },
        lastResetDate: new Date(),
      },
    });
    return NextResponse.json(newGameState);
  }

  return NextResponse.json(user.gameState);
}
