// server/api/routers/game.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const gameRouter = createTRPCRouter({
  getGameState: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    let gameState = await prisma.gameState.findUnique({
      where: { userId },
    });

    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          userId,
          pickedSongs: [],
          dailySongFound: false,
          guessState: { guessedCorrectly: false, attempts: 0 },
          lastResetDate: new Date(),
        },
      });
    }

    return gameState;
  }),

  getCommonGameState: protectedProcedure.query(async () => {
    let commonGameState = await prisma.commonGameState.findFirst();

    if (!commonGameState) {
      commonGameState = await prisma.commonGameState.create({
        data: {
          lastResetDate: new Date(),
        },
      });
    }

    return commonGameState;
  }),

  updateGameState: protectedProcedure
    .input(
      z.object({
        pickedSongs: z.array(z.any()),
        dailySongFound: z.boolean(),
        guessState: z.object({
          guessedCorrectly: z.boolean(),
          attempts: z.number(),
        }),
        lastResetDate: z.string().datetime(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updatedGameState = await prisma.gameState.update({
        where: { userId },
        data: input,
      });
      return updatedGameState;
    }),
});
