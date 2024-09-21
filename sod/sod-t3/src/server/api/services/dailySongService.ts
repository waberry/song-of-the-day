import { PrismaClient, Prisma } from '@prisma/client';
import { getPopularTracks, fetchGenresForSong, getSpotifyAccessToken } from './spotifyService';
import { generateKeySync } from 'crypto';

const prisma = new PrismaClient();

function pickTrackFields(track: any): Prisma.TrackCreateInput {
  return {
    id: track.id,
    name: track.name,
    duration_ms: track.duration_ms,
    popularity: track.popularity,
    preview_url: track.preview_url,
    external_urls: track.external_urls,
    external_ids: track.external_ids,
    uri: track.uri,
    explicit: track.explicit,
    is_local: track.is_local,
    disc_number: track.disc_number,
    track_number: track.track_number,
    type: track.type,
    href: track.href,
    available_markets: track.available_markets,
    album: {
      connectOrCreate: {
        where: { id: track.album.id },
        create: {
          id: track.album.id,
          name: track.album.name,
          release_date: track.album.release_date,
          release_date_precision: track.album.release_date_precision,
          total_tracks: track.album.total_tracks,
          type: track.album.type,
          external_urls: track.album.external_urls,
          images: {
            create: track.album.images.map((image: any) => ({
              url: image.url,
              height: image.height,
              width: image.width,
            })),
          },
        },
      },
    },
    artists: {
      create: track.artists.map((artist: any) => ({
        artist: {
          connectOrCreate: {
            where: { id: artist.id },
            create: {
              id: artist.id,
              name: artist.name,
              uri: artist.uri,
              external_urls: artist.external_urls,
              type: artist.type,
              href: artist.href,
              popularity: artist.popularity || 0,
              followers: artist.followers || { total: 0 },
              genres: artist.genres || [],
            },
          },
        },
      })),
    },
  };
}

export async function selectAndStoreDailySong(accessToken: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Try to find an existing DailySong for today
    let dailySong = await prisma.dailySong.findUnique({
      where: { selectedDate: today },
      include: {
        track: {
          include: { artists: { include: { artist: true } }, album: true },
        },
      },
    });

    // If a DailySong for today exists, return it
    if (dailySong) {
      console.log("Existing daily song found for today");
      return dailySong;
    }

    console.log("No daily song found for today. Selecting a new one.");

    // If no DailySong exists for today, create a new one
    const popularTracks = await getPopularTracks(accessToken);
    const randomTrack = popularTracks[Math.floor(Math.random() * popularTracks.length)];
    if (randomTrack) console.log("Random track selected");

    // Try to find the track in the database
    let track = await prisma.track.findUnique({
      where: { id: randomTrack.id },
      include: { artists: { include: { artist: true } }, album: true },
    });

    // If the track doesn't exist, create it
    if (!track) {
      console.log("Creating new track in the database");
      const trackData = pickTrackFields(randomTrack);
      track = await prisma.track.create({
        data: trackData,
        include: { artists: { include: { artist: true } }, album: true },
      });
    }

    // Create the DailySong entry with additional information
    console.log("Creating new DailySong entry");
    dailySong = await prisma.dailySong.create({
      data: {
        trackId: track.id,
        selectedDate: today,
        genres: await fetchGenresForSong(track.artists.flatMap(a => a.artistId).join(","), await getSpotifyAccessToken()),

        // name: track.name,
        // albumName: track.album.name,
        // artistNames: track.artists.map(a => a.artist.name),
        // duration_ms: track.duration_ms,
        // popularity: track.popularity,
        // preview_url: track.preview_url,
        // external_urls: track.external_urls,
        // release_date: track.album.release_date,
        // album_images: track.album.images,
        
      },
      include: {
        track: {
          include: { artists: { include: { artist: true } }, album: true },
        },
      },
    });

    console.log("New daily song created successfully");
    return dailySong;
  } catch (error) {
    console.error("Error in selectAndStoreDailySong:", error);
    // If the error is due to a unique constraint violation, try to fetch the existing record
    if (error.code === "P2002" && error.meta?.target?.includes("selectedDate")) {
      console.log("Unique constraint violation. Fetching existing daily song.");
      const existingDailySong = await prisma.dailySong.findUnique({
        where: { selectedDate: today },
        include: {
          track: {
            include: { artists: { include: { artist: true } }, album: true },
          },
        },
      });
      if (existingDailySong) {
        return existingDailySong.track;
      }
    }
    throw error;
  }
}