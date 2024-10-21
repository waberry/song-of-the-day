import { z } from 'zod';
import { createTRPCRouter as router, publicProcedure } from '~/server/api/trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRouter = router({
  get: publicProcedure
    .input(
      z.object({
        anonymousUserId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Get all of today's guesses from this user
        const todayGuesses = await prisma.guess.findMany({
          where: {
            user: {
              anonymousUserId: input.anonymousUserId
            },
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
          include: {
            mode: true
          }
        });

        // Calculate daily streak per mode
        const dailyStreak = todayGuesses.reduce((streak, guess) => {
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
          by: ['mode.name'],
          where: {
            user: {
              anonymousUserId: input.anonymousUserId
            },
            success: true
          },
          _count: {
            _all: true
          }
        });

        // Calculate current streak
        const currentStreak = todayGuesses.reduce((streak, guess) => {
          return guess.success ? streak + 1 : 0;
        }, 0);

        // Return data
        const data = {
          todayGuesses,
          dailyStreak,
          maxStreak: maxStreak.reduce((acc, item) => {
            acc[item.mode.name] = item._count._all;
            return acc;
          }, {}),
          currentStreak,
        };

        return data;
      } catch (error) {
        console.error("Error in user get mutation:", error);
        throw new Error("An error occurred while processing the user data");
      }
    }),
});