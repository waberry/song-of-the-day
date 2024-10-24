import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const prisma = new PrismaClient();

export const userIdentificationSchema = z.object({
  fingerprint: z.string(),
  userAgent: z.string(),
  browser: z.string(),
  browserVersion: z.string(),
  os: z.string(),
  osVersion: z.string(),
  screenResolution: z.string(),
  timezone: z.string(),
});

export type UserIdentification = z.infer<typeof userIdentificationSchema>;

export async function findOrCreateUser(identification: UserIdentification) {
  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: {
        fingerprint: identification.fingerprint,
      },
    });

    // If user doesn't exist, create new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          anonymousUserId: identification.fingerprint,
          fingerprint: identification.fingerprint,
          userAgent: identification.userAgent,
          browser: identification.browser,
          browserVersion: identification.browserVersion,
          os: identification.os,
          osVersion: identification.osVersion,
          screenResolution: identification.screenResolution,
          timezone: identification.timezone,
          firstVisit: new Date(),
          lastVisit: new Date(),
        },
      });
    } else {
      // Update last visit time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastVisit: new Date() },
      });
    }

    return user;
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process user identification',
      cause: error,
    });
  }
}