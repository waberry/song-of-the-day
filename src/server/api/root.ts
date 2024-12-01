import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { songRouter } from "./routers/song";
import { modeRouter } from "./routers/modes";
import { playerRouter } from "./routers/player";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  mode: modeRouter,
  song: songRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);
