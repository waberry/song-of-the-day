import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  spotifyAuthenticatedProcedure,
} from "~/server/api/trpc";
import {
  getSpotifyAccessToken,
  searchSpotifyTracks,
  getTopTracks,
  getRecentlyPlayed,
  getUserProfile,
  getPlayHistory,
  getTopArtists,
  getSavedTracks,
  getSavedAlbums,
  getUserPlaylists,
  getAudioFeaturesForTracks,
  getNewReleases,
  getFollowedArtists,
  getAvailableGenreSeeds,
  getRecommendations,
  getCurrentlyPlaying,
  getDevices,
  getTrackAnalysis,
} from "../services/spotifyService";
import { selectAndStoreDailySong } from "../services/dailySongService";
import { TRPCError } from "@trpc/server";

export const spotifyRouter = createTRPCRouter({
  // searchTracks: publicProcedure
  //   .input(z.object({ searchTerm: z.string().min(1) }))
  //   .query(async ({ input }) => {
  //     const spotifyAccessToken = await getSpotifyAccessToken();
  //     return searchSpotifyTracks(spotifyAccessToken, input.searchTerm);
  //   }),
  //
  searchTracks: publicProcedure
    .input(z.object({ searchTerm: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const spotifyAccessToken = await getSpotifyAccessToken();
        if (!spotifyAccessToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to obtain Spotify access token",
          });
        }
        const tracks = await searchSpotifyTracks(
          spotifyAccessToken,
          input.searchTerm,
        );
        return tracks;
      } catch (error) {
        console.error("Error in searchTracks:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while searching tracks",
        });
      }
    }),

  getDailySong: publicProcedure.query(async () => {
    try {
      const accessToken = await getSpotifyAccessToken();
      if (!accessToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to obtain Spotify access token",
        });
      }
      const dailySong = await selectAndStoreDailySong(accessToken);
      return dailySong;
    } catch (error) {
      console.error("Error in getDailySong:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the daily song",
      });
    }
  }),

  getUserProfile: spotifyAuthenticatedProcedure.query(async ({ ctx }) => {
    try {
      // if (!ctx.refreshToken) {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "Refresh token is missing",
      //   });
      // }
      const profile = await getUserProfile(ctx.accessToken, ctx.refreshToken);
      return profile;
    } catch (error) {
      if (error.message === "Authentication required") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User needs to re-authenticate",
        });
      } else {
        // Log the error for debugging
        console.error("Error in getUserProfile procedure:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          ...error,
        });
      }
    }
  }),

  getTopTracks: spotifyAuthenticatedProcedure
    .input(
      z
        .object({
          timeRange: z
            .enum(["short_term", "medium_term", "long_term"])
            .optional()
            .default("medium_term"),
          limit: z.number().min(1).max(50).optional().default(50),
        })
        .optional()
        .default({}),
    )
    .query(async ({ ctx, input }) => {
      return getTopTracks(ctx.accessToken, input.limit, input.timeRange);
    }),

  getRecentlyPlayed: spotifyAuthenticatedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional().default(20),
        })
        .optional()
        .default({}),
    )
    .query(async ({ ctx, input }) => {
      return getRecentlyPlayed(ctx.accessToken, input.limit);
    }),

  getPlayHistory: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getPlayHistory(ctx.accessToken, input.limit, input.cursor);
    }),

  // getDailySong: publicProcedure.query(async () => {
  //   const accessToken = await getSpotifyAccessToken();
  //   if (!accessToken) {
  //     throw new Error("No token available");
  //   }
  //   return selectAndStoreDailySong(accessToken);
  // }),

  // New procedures

  getTopArtists: spotifyAuthenticatedProcedure
    .input(
      z
        .object({
          timeRange: z
            .enum(["short_term", "medium_term", "long_term"])
            .optional()
            .default("medium_term"),
          limit: z.number().min(1).max(50).optional().default(20),
        })
        .optional()
        .default({}),
    )
    .query(async ({ ctx, input }) => {
      return getTopArtists(ctx.accessToken, input.limit, input.timeRange);
    }),

  getSavedTracks: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getSavedTracks(ctx.accessToken, input.limit, input.offset);
    }),

  getSavedAlbums: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getSavedAlbums(ctx.accessToken, input.limit, input.offset);
    }),

  getUserPlaylists: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getUserPlaylists(ctx.accessToken, input.limit, input.offset);
    }),

  getAudioFeaturesForTracks: spotifyAuthenticatedProcedure
    .input(
      z.object({
        trackIds: z.array(z.string()).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getAudioFeaturesForTracks(ctx.accessToken, input.trackIds);
    }),

  getNewReleases: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getNewReleases(ctx.accessToken, input.limit, input.offset);
    }),

  getFollowedArtists: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
        after: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getFollowedArtists(ctx.accessToken, input.limit, input.after);
    }),

  getAvailableGenreSeeds: spotifyAuthenticatedProcedure.query(
    async ({ ctx }) => {
      return getAvailableGenreSeeds(ctx.accessToken);
    },
  ),

  getRecommendations: spotifyAuthenticatedProcedure
    .input(
      z.object({
        seedArtists: z.array(z.string()).optional(),
        seedGenres: z.array(z.string()).optional(),
        seedTracks: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getRecommendations(ctx.accessToken, input);
    }),

  getCurrentlyPlaying: spotifyAuthenticatedProcedure.query(async ({ ctx }) => {
    return getCurrentlyPlaying(ctx.accessToken);
  }),

  getDevices: spotifyAuthenticatedProcedure.query(async ({ ctx }) => {
    return getDevices(ctx.accessToken);
  }),

  getTrackAnalysis: spotifyAuthenticatedProcedure
    .input(z.object({ trackId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getTrackAnalysis(ctx.accessToken, input.trackId);
    }),
});
