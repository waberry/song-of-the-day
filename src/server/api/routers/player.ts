import { z } from "zod";
import { createTRPCRouter as router, publicProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

// Input validation schemas
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

// Utility to get today's date range
const getDateRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  return { startOfDay, endOfDay };
};

// Utility to calculate streaks
const calculateStreak = (guesses: any[], currentDate: Date) => {
  const sortedGuesses = [...guesses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;

  for (const guess of sortedGuesses) {
    if (guess.success && guess.date <= currentDate) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const playerRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .query(() => {
      return "Hello, tRPC!";
    }),

  get: publicProcedure
    .input(z.object({ anonymousUserId: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { anonymousUserId: input.anonymousUserId },
        include: { guesses: { include: { mode: true } } },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const { startOfDay, endOfDay } = getDateRange();
      const todayGuesses = user.guesses.filter(
        (guess) => guess.date >= startOfDay && guess.date <= endOfDay
      );

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

      const maxStreak = await prisma.guess.groupBy({
        by: ["modeId"],
        where: { userId: user.id, success: true },
        _count: { _all: true },
      });

      const currentStreak = calculateStreak(user.guesses, new Date());

      return {
        todayGuesses,
        dailyStreak,
        maxStreak: maxStreak.reduce<Record<string, number>>((acc, streak) => {
          acc[streak.modeId] = streak._count._all;
          return acc;
        }, {}),
        currentStreak,
      };
    }),

  submitGuess: publicProcedure
    .input(
      z.object({
        anonymousUserId: z.string(),
        modeId: z.number(),
        songSpotifyId: z.string(),
        success: z.boolean(),
        diff: z.record(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { anonymousUserId: input.anonymousUserId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
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
        include: { mode: true },
      });

      return guess;
    }),

  getStats: publicProcedure
    .input(z.object({ anonymousUserId: z.string(), modeId: z.number().optional() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { anonymousUserId: input.anonymousUserId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const stats = await prisma.guess.groupBy({
        by: ["modeId"],
        where: {
          userId: user.id,
          ...(input.modeId ? { modeId: input.modeId } : {}),
        },
        _count: { _all: true, success: true },
      });

      return stats;
    }),

  identify: publicProcedure
    .input(fingerprintSchema)
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: { anonymousUserId: input.fingerprint },
      });

      if (existingUser) {
        return { anonymousUserId: existingUser.anonymousUserId, isNewUser: false };
      }

      const newUser = await prisma.user.create({
        data: { anonymousUserId: input.fingerprint },
      });

      return { anonymousUserId: newUser.anonymousUserId, isNewUser: true };
    }),
});
