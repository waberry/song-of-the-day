// playerRouter.ts
import { z } from 'zod';
import { createTRPCRouter as router, publicProcedure } from '~/server/api/trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const playerRouter = router({
  get: publicProcedure
    .input(
      z.object({
        anonymousUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get all of today's guesses from this user
        const todayGuesses = await prisma.guess.findMany({
          where: {
            user: {
              anonymousUserId: input.anonymousUserId
            },
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
          include: {
            mode: true
          }
        });

        // Calculate daily streak per mode
        const dailyStreak = todayGuesses.reduce<Record<string, typeof todayGuesses>>((streak, guess) => {
          const mode = guess.mode.name;
          if (!streak[mode]) {
            streak[mode] = [];
          }
          if (guess.success) {
            streak[mode].push(guess);
          }
          return streak;
        }, {});

        // Calculate max streak per mode
        const maxStreak = await prisma.guess.groupBy({
          by: ['modeId'],
          where: {
            user: {
              anonymousUserId: input.anonymousUserId
            },
            success: true
          },
          _count: {
            _all: true
          },
          orderBy: {
            modeId: 'asc'
          },
        });

        // Calculate current streak
        const currentStreak = todayGuesses.reduce((streak, guess) => {
          return guess.success ? streak + 1 : 0;
        }, 0);

        // Return data
        return {
          todayGuesses,
          dailyStreak,
          maxStreak: maxStreak.reduce<Record<string, number>>((acc, item) => {
            acc[item.modeId] = item._count._all;
            return acc;
          }, {}),
          currentStreak,
        };
      } catch (error) {
        console.error("Error in user get mutation:", error);
        throw new Error("An error occurred while processing the user data");
      }
    }),
});