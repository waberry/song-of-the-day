import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { create } from "domain";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const prisma = new PrismaClient();

export const modeRouter = createTRPCRouter({
  getModes: publicProcedure
  .query(async () => {
    return await prisma.mode.findMany();
  }),
  createMode: publicProcedure
  .input(
    z.object({
      playlistId: z.string(),
    })
  ).mutation(async ({ input }) => {
    console.log('Validated input:', input); // Zod validates the input here

    const { playlistId } = input;

    const mode = await prisma.mode.create({
      data: {
        playlistId: playlistId,
        name: "New mode",
      },
    });

    return mode;
  })
});
