import { PrismaClient } from "@prisma/client";
import { getPopularTracks } from "./spotifyService";

const prisma = new PrismaClient();

export async function selectAndStoreDailySong(accessToken: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const popularTracks = await getPopularTracks(accessToken);
  const randomTrack =
    popularTracks[Math.floor(Math.random() * popularTracks.length)];

  let track = await prisma.track.findUnique({
    where: { id: randomTrack.id },
    include: { artists: { include: { artist: true } }, album: true },
  });

  if (!track) {
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
              releaseDate: randomTrack.album.release_date,
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

  await prisma.dailySong.create({
    data: {
      trackId: track.id,
      selectedDate: today,
    },
  });

  return track;
}
