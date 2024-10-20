import { z } from "zod";
import { createTRPCRouter as router, publicProcedure } from '~/server/api/trpc';

const testRouter = router({
    test: publicProcedure
      .input(z.object({
        name: z.string(),
      }))
      .mutation(({ input }) => {
        return `Hello, ${input.name}`;
      }),
  });