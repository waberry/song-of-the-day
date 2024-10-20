"use server";
import musicBrainz from "~/server/api/services/musicbrainzService";

export async function getArtistsCountries(artistNames: string | string[]): Promise<(string | null)[]> {
    const artistsInfo = await musicBrainz.getArtistsInfo(artistNames);
    return artistsInfo.map(artist => artist.country);
}

export async function getSongsInfo(trackName: string, artistNames: string | string[]) {
    return musicBrainz.getRecordingsInfo(trackName, artistNames);
}

export async function getAlbumsInfo(albumName: string, artistNames: string | string[]) {
    return musicBrainz.getReleasesInfo(albumName, artistNames);
}