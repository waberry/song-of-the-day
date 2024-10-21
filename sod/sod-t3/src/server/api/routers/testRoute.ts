import { z } from "zod";
import { createTRPCRouter as router, publicProcedure } from '~/server/api/trpc';


export const testRouter = router({
  test: publicProcedure
    .input(z.object({
      name: z.string(),
      time: z.string()
    }))
    .mutation(async ({ input }) => {
      console.log('Received input:', input);
      return { 
        result: 'Input received',
        inputData: input
      };
    }),
});