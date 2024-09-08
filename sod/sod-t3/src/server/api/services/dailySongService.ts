import { PrismaClient } from "@prisma/client";
import { getPopularTracks } from "./spotifyService";

const prisma = new PrismaClient();

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

    // If a DailySong for today exists, return its track
    if (dailySong) {
      console.log("Existing daily song found for today");
      return dailySong.track;
    }

    console.log("No daily song found for today. Selecting a new one.");

    // If no DailySong exists for today, create a new one
    const popularTracks = await getPopularTracks(accessToken);
    const randomTrack =
      popularTracks[Math.floor(Math.random() * popularTracks.length)];

    // Try to find the track in the database
    let track = await prisma.track.findUnique({
      where: { id: randomTrack.id },
      include: { artists: { include: { artist: true } }, album: true },
    });

    // If the track doesn't exist, create it
    if (!track) {
      console.log("Creating new track in the database");
      track = await prisma.track.create({
        data: {
          id: randomTrack.id,
          name: randomTrack.name,
          duration: randomTrack.duration_ms,
          popularity: randomTrack.popularity,
          previewUrl: randomTrack.preview_url,
          spotifyUrl: randomTrack.external_urls.spotify,
          album: {
            connectOrCreate: {
              where: { id: randomTrack.album.id },
              create: {
                id: randomTrack.album.id,
                name: randomTrack.album.name,
                releaseDate: randomTrack.album.release_date, // TODO fix naming issue here
                imageUrl: randomTrack.album.images[0].url,
                spotifyUrl: randomTrack.album.external_urls.spotify,
              },
            },
          },
          artists: {
            create: randomTrack.artists.map((artist) => ({
              artist: {
                connectOrCreate: {
                  where: { id: artist.id },
                  create: {
                    id: artist.id,
                    name: artist.name,
                    spotifyUrl: artist.external_urls.spotify,
                  },
                },
              },
            })),
          },
        },
        include: { artists: { include: { artist: true } }, album: true },
      });
    }

    // Create the DailySong entry
    console.log("Creating new DailySong entry");
    dailySong = await prisma.dailySong.create({
      data: {
        trackId: track.id,
        selectedDate: today,
      },
      include: {
        track: {
          include: { artists: { include: { artist: true } }, album: true },
        },
      },
    });

    console.log("New daily song created successfully");
    return dailySong.track;
  } catch (error) {
    console.error("Error in selectAndStoreDailySong:", error);
    // If the error is due to a unique constraint violation, try to fetch the existing record
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("selectedDate")
    ) {
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
