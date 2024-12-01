import { z } from 'zod';
import { createTRPCRouter as router, publicProcedure } from '~/server/api/trpc';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

// Input validation schemas
const userIdentificationSchema = z.object({
  fingerprint: z.string(),
  userAgent: z.string(),
  browser: z.string(),
  browserVersion: z.string(),
  os: z.string(),
  osVersion: z.string(),
  screenResolution: z.string(),
  timezone: z.string(),
});

const fingerprintSchema = z.object({
  userAgent: z.string(),
  browser: z.string(),
  browserVersion: z.string(),
  os: z.string(),
  osVersion: z.string(),
  screenResolution: z.string(),
  timezone: z.string(),
  fingerprint: z.string(),
});

export const playerRouter = router({
  hello: publicProcedure
  .input(z.object({ text: z.string().min(1) }))
  .query(async ({ input }) => {
    return "YOOO";
  }),
  get: publicProcedure
    .input(z.object({
      anonymousUserId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by anonymousUserId
        const user = await prisma.user.findUnique({
          where: {
            anonymousUserId: input.anonymousUserId,
          },
          include: {
            guesses: {
              include: {
                mode: true,
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Get today's guesses
        const todayGuesses = user.guesses.filter(guess => 
          guess.date >= startOfDay && guess.date <= endOfDay
        );

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
            userId: user.id,
            success: true,
          },
          _count: {
            _all: true,
          },
        });

        // Calculate current streak
        const currentStreak = calculateCurrentStreak(user.guesses);

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
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while processing the user data',
          cause: error,
        });
      }
    }),

  submitGuess: publicProcedure
    .input(z.object({
      anonymousUserId: z.string(),
      modeId: z.number(),
      songSpotifyId: z.string(),
      success: z.boolean(),
      diff: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { anonymousUserId: input.anonymousUserId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        const guess = await prisma.guess.create({
          data: {
            userId: user.id,
            modeId: input.modeId,
            songSpotifyId: input.songSpotifyId,
            success: input.success,
            diff: input.diff,
          },
          include: {
            mode: true,
          },
        });

        return guess;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to submit guess',
          cause: error,
        });
      }
    }),

  getStats: publicProcedure
    .input(z.object({
      anonymousUserId: z.string(),
      modeId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { anonymousUserId: input.anonymousUserId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        const whereClause = {
          userId: user.id,
          ...(input.modeId ? { modeId: input.modeId } : {}),
        };

        const stats = await prisma.guess.groupBy({
          by: ['modeId'],
          where: whereClause,
          _count: {
            _all: true,
            success: true,
          },
        });

        return stats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch stats',
          cause: error,
        });
      }
    }),

  identify: publicProcedure
    .input(fingerprintSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { anonymousUserId: input.fingerprint }
      });

      if (existingUser) {
        return {
          anonymousUserId: existingUser.anonymousUserId,
          isNewUser: false
        };
      }

      const newUser = await ctx.db.user.create({
        data: {
          anonymousUserId: input.fingerprint
        }
      });

      return {
        anonymousUserId: newUser.anonymousUserId,
        isNewUser: true
      };
    }),
});
// Helper function to calculate current streak
function calculateCurrentStreak(guesses: any[]): number {
  const sortedGuesses = [...guesses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  for (const guess of sortedGuesses) {
    if (guess.success) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
