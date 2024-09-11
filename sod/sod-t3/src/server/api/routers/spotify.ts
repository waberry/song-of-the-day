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
  fetchPlayHistory,
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
  fetchArtistInfo,
  fetchGenresForSong,
} from "../services/spotifyService";
import { selectAndStoreDailySong } from "../services/dailySongService";
import { TRPCError } from "@trpc/server";
import { access } from "fs";

export const spotifyRouter = createTRPCRouter({
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
  
  getGenres: publicProcedure
  .input(z.object({ ids: z.string() }))
  .query(async ({ input }) => {
    if (input.ids === "" || !input.ids) return [];
    let genres = [];
    try {
      const accessToken = await getSpotifyAccessToken();
      if (!accessToken){
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "getGenres - Failed to obtain Spotify access token",
        });
      }
      genres = await fetchGenresForSong(input.ids, accessToken)
      return genres;
    }catch(error){
      console.log("fetching Genre Error \n", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the genres\n",
      });

    }
  }),
  getArtists: publicProcedure
  .input(z.object({ ids: z.string() }))
  .query(async ({ input }) => {
    if (input.ids === "" || !input.ids) return [];
    try {
      const accessToken = await getSpotifyAccessToken();
      console.log("procedure getArtists input: ", input.ids);
      if (!accessToken){
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "getGenres - Failed to obtain Spotify access token",
        });
      }
      let resp =  await fetchArtistInfo(input.ids, accessToken)
      return resp;
    }catch(error){
      console.log("fetching Artists Info: Error: \n", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the genres\n",
      });

    }
  }),
  getDailySong: publicProcedure.query(async () => {
    try {
      const accessToken = await getSpotifyAccessToken();
      if (!accessToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "getDailySong - Failed to obtain Spotify access token",
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

  fetchStorePlayHistory: spotifyAuthenticatedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const historyItems = await fetchPlayHistory(ctx.accessToken, input.limit, input.cursor);
      console.log("ITEMS -> \n", historyItems);
      // Process and store each track in the database
      await Promise.all(historyItems.map(async (item) => {
        const { track, played_at } = item;
        const imageUrl = track.album.images.length > 0 ? track.album.images[0].url : '';
        const albumName = track.album.name;
        const artists = track.artists.map(artist => artist.name).join(', '); // Joining artist names into a single string

        return prisma.history.upsert({
          where: { id: track.id },
          update: {
            name: track.name,
            imageUrl,
            albumName,
            spotifyUrl: track.external_urls.spotify,
            artists,
            playedAt: new Date(played_at), // Adjusted to the actual play time
            updatedAt: new Date(),
          },
          create: {
            id: track.id,
            name: track.name,
            imageUrl,
            albumName,
            spotifyUrl: track.external_urls.spotify,
            artists,
            playedAt: new Date(played_at),
            spotifyUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }));

      return historyItems;
    }),




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
