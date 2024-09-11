import { Track, Artist, Album } from '@prisma/client';

// Constants
const DURATION_THRESHOLD_MS = 2000;
const POPULARITY_THRESHOLD = 10;

export enum ComparisonKey {
  Artist = 'artist',
  Album = 'album',
  Year = 'year',
  Decade = 'decade',
  Genre = 'genre',
  Popularity = 'popularity',
  Duration = 'duration',
  ArtistCountry = 'artistCountry'
}

export type ComparisonResult = {
  [key in ComparisonKey]: {
    result: boolean;
    message: string;
    selectedValue: string | number;
    dailyValue: string | number;
    comparison?: 'higher' | 'lower' | 'equal';
  };
};

// Utility functions
export const removeDuplicates = (genres: string[] | undefined): string[] => 
  Array.from(new Set(genres?.map(genre => genre.trim().toLowerCase()) || []));

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Comparison functions
const compareArtists = (selectedArtists: Artist[], dailyArtists: Artist[]): ComparisonResult[ComparisonKey.Artist] => ({
  result: selectedArtists.some(artist => dailyArtists.some(dailyArtist => dailyArtist.id === artist.id)),
  message: `${selectedArtists[0].name}${selectedArtists.length > 1 ? ` ft. ${selectedArtists.slice(1).map(a => a.name).join(', ')}` : ''}`,
  selectedValue: selectedArtists.map(a => a.name).join(', '),
  dailyValue: dailyArtists.map(a => a.name).join(', '),
});

const compareAlbums = (selectedAlbum: Album, dailyAlbum: Album): ComparisonResult[ComparisonKey.Album] => ({
  result: selectedAlbum.id === dailyAlbum.id,
  message: `Album: ${selectedAlbum.name}`,
  selectedValue: selectedAlbum.name,
  dailyValue: dailyAlbum.name,
});

const compareYears = (selectedYear: number, dailyYear: number): ComparisonResult[ComparisonKey.Year] => ({
  result: selectedYear === dailyYear,
  message: selectedYear === dailyYear ? `Released in ${selectedYear}` : selectedYear < dailyYear ? `Go more recent (${selectedYear})` : `Go older (${selectedYear})`,
  selectedValue: selectedYear,
  dailyValue: dailyYear,
  comparison: selectedYear === dailyYear ? 'equal' : selectedYear < dailyYear ? 'lower' : 'higher',
});

const compareDecades = (selectedYear: number, dailyYear: number): ComparisonResult[ComparisonKey.Decade] => {
  const selectedDecade = Math.floor(selectedYear / 10) * 10;
  const dailyDecade = Math.floor(dailyYear / 10) * 10;
  return {
    result: selectedDecade === dailyDecade,
    message: selectedDecade === dailyDecade ? `Same decade: ${selectedDecade}s` : selectedDecade < dailyDecade ? `Go to a later decade (${selectedDecade}s)` : `Go to an earlier decade (${selectedDecade}s)`,
    selectedValue: `${selectedDecade}s`,
    dailyValue: `${dailyDecade}s`,
    comparison: selectedDecade === dailyDecade ? 'equal' : selectedDecade < dailyDecade ? 'lower' : 'higher',
  };
};
const compareGenres = (selectedGenres: string[], dailyGenres: string[]): ComparisonResult[ComparisonKey.Genre] => ({
  result: selectedGenres.some(genre => dailyGenres.includes(genre)),
  message: selectedGenres.length ? `Genres: ${selectedGenres.join(', ')}` : 'No Data',
  selectedValue: removeDuplicates(selectedGenres).join(' '),
  dailyValue: removeDuplicates(dailyGenres).join(' '),
});

const comparePopularity = (selectedPopularity: number, dailyPopularity: number): ComparisonResult[ComparisonKey.Popularity] => ({
  result: Math.abs(selectedPopularity - dailyPopularity) <= POPULARITY_THRESHOLD,
  message: Math.abs(selectedPopularity - dailyPopularity) <= POPULARITY_THRESHOLD ? 'Similar popularity' : selectedPopularity > dailyPopularity ? 'Go less popular' : 'Go more popular',
  selectedValue: selectedPopularity,
  dailyValue: dailyPopularity,
  comparison: selectedPopularity === dailyPopularity ? 'equal' : selectedPopularity < dailyPopularity ? 'lower' : 'higher',
});

const compareDuration = (selectedDuration: number, dailyDuration: number): ComparisonResult[ComparisonKey.Duration] => {
  const diff = selectedDuration - dailyDuration;
  const selectedMinSec = formatDuration(selectedDuration);
  return {
    result: Math.abs(diff) <= DURATION_THRESHOLD_MS,
    message: Math.abs(diff) <= DURATION_THRESHOLD_MS ? `Equal duration (${selectedMinSec})` : diff > 0 ? `Go shorter (${selectedMinSec})` : `Go longer (${selectedMinSec})`,
    selectedValue: formatDuration(selectedDuration),
    dailyValue: dailyDuration,
    comparison: selectedDuration === dailyDuration ? 'equal' : selectedDuration < dailyDuration ? 'lower' : 'higher',
  };
};

export const truncateGenres = (genres: string, limit: number = 2) => {
  const genreList = genres.split(' ');
  if (genreList.length <= limit) return genres;
  return `${genreList.slice(0, limit).join(' ')} ...`;
};

export const extractUniqueGenres = (artists) => {
  if (!artists) return [];
  let allGenres = [];
  
  for (const k in artists) {
    for (const l in artists[k].genres) {
      allGenres.push(artists[k].genres[l]);
    }
  }
  const uniqueGenres = Array.from(new Set(allGenres));
  return uniqueGenres.sort();
}

export const getDetailedSongComparison = async (
  selectedSong: any,
  dailySong: any,
  selectedSongArtists: any,
  dailySongArtists: any,
): Promise<ComparisonResult> => {
  const selectedYear = new Date(selectedSong.album.release_date || '').getFullYear();
  const dailyYear = new Date(dailySong.album.releaseDate || '').getFullYear();

  const selectedArtistCountry =  "Unknown";
  const dailyArtistCountry =  "Unknown";

  const selectedGenres = extractUniqueGenres(selectedSongArtists);
  const dailyGenres = extractUniqueGenres(dailySongArtists);
  console.log("Comparing genres: ", selectedGenres, dailyGenres);

  return {
    [ComparisonKey.Artist]: compareArtists(selectedSong.artists, dailySong.artists),
    [ComparisonKey.Album]: compareAlbums(selectedSong.album, dailySong.album),
    [ComparisonKey.Year]: compareYears(selectedYear, dailyYear),
    [ComparisonKey.Decade]: compareDecades(selectedYear, dailyYear),
    [ComparisonKey.Genre]: compareGenres(selectedGenres, dailyGenres),
    [ComparisonKey.Popularity]: comparePopularity(selectedSong.popularity!, dailySong.popularity!),
    [ComparisonKey.Duration]: compareDuration(selectedSong.duration_ms, dailySong.duration),
    [ComparisonKey.ArtistCountry]: {
      result: selectedArtistCountry === dailyArtistCountry,
      message: `Artist from ${selectedArtistCountry}`,
      selectedValue: selectedArtistCountry,
      dailyValue: dailyArtistCountry,
    },
  };
};

export const isCorrectGuess = (selectedSong: Track, dailySong: Track): boolean => {
  if (selectedSong.id === dailySong.id) return true;

  const nameMatch = selectedSong.name.toLowerCase() === dailySong.name.toLowerCase();
  const artistMatch = selectedSong.artists.some((artist) =>
    dailySong.artists.some((dailyArtist) => dailyArtist.name.toLowerCase() === artist.name.toLowerCase())
  );
  const durationMatch = Math.abs(selectedSong.duration_ms - dailySong.duration) <= DURATION_THRESHOLD_MS;
  const albumMatch = selectedSong.album.name.toLowerCase() === dailySong.album.name.toLowerCase();

  return nameMatch && artistMatch && (durationMatch || albumMatch);
};