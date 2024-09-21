import { Track, Artist, Album } from '@prisma/client';

// Constants
const DURATION_THRESHOLD_MS = 1000;
const POPULARITY_THRESHOLD = 5;
const GENRE_SIMILARITIES = 1;

export enum ComparisonKey {
  Artist = 'artists',
  Album = 'album',
  Year = 'year',
  Decade = 'decade',
  Genre = 'Genres',
  Popularity = 'popularity',
  Duration = 'duration',
  ArtistCountry = 'country'
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

const similarGenres = (selectedGenres: string[], dailyGenres: string[]): number => {
  if (!selectedGenres || !dailyGenres)  return 0;
  if(!dailyGenres) throw new Error("ye!");
  const dailyGenreSet = new Set(dailyGenres);
  return selectedGenres.filter(genre => dailyGenreSet.has(genre)).length;
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
  comparison: selectedYear === dailyYear ? 'equal' : selectedYear < dailyYear ? 'higher' : 'lower',
});

const compareDecades = (selectedYear: number, dailyYear: number): ComparisonResult[ComparisonKey.Decade] => {
  const selectedDecade = Math.floor(selectedYear / 10) * 10;
  const dailyDecade = Math.floor(dailyYear / 10) * 10;
  return {
    result: selectedDecade === dailyDecade,
    message: selectedDecade === dailyDecade ? `Same decade: ${selectedDecade}s` : selectedDecade < dailyDecade ? `Go to a later decade (${selectedDecade}s)` : `Go to an earlier decade (${selectedDecade}s)`,
    selectedValue: `${selectedDecade}s`,
    dailyValue: `${dailyDecade}s`,
    comparison: selectedDecade === dailyDecade ? 'equal' : selectedDecade < dailyDecade ? 'higher' : 'lower',
  };
};

const compareGenres = (selectedGenres: string[] | undefined, dailyGenres: string[] | undefined): ComparisonResult[ComparisonKey.Genre] => {
  const safeSelectedGenres = selectedGenres || [];
  const safeDailyGenres = dailyGenres || [];

  return {
    result: similarGenres(safeSelectedGenres, safeDailyGenres) >= GENRE_SIMILARITIES,
    message: safeSelectedGenres.length ? `Genres: ${safeSelectedGenres.join(', ')}` : 'No Data',
    selectedValue: safeSelectedGenres.join(', '),
    dailyValue: safeDailyGenres.join(', '),
  };
};

const comparePopularity = (selectedPopularity: number, dailyPopularity: number): ComparisonResult[ComparisonKey.Popularity] => ({
  result: Math.abs(selectedPopularity - dailyPopularity) <= POPULARITY_THRESHOLD,
  message: Math.abs(selectedPopularity - dailyPopularity) <= POPULARITY_THRESHOLD ? 'Similar popularity' : selectedPopularity > dailyPopularity ? 'Go less popular' : 'Go more popular',
  selectedValue: selectedPopularity,
  dailyValue: dailyPopularity,
  comparison: selectedPopularity === dailyPopularity ? 'equal' : selectedPopularity < dailyPopularity ? 'higher' : 'lower',
});

const compareDuration = (selectedDuration: number, dailyDuration: number): ComparisonResult[ComparisonKey.Duration] => {
  const diff = selectedDuration - dailyDuration;
  const selectedMinSec = formatDuration(selectedDuration);
  return {
    result: Math.abs(diff) <= DURATION_THRESHOLD_MS,
    message: Math.abs(diff) <= DURATION_THRESHOLD_MS ? `Equal duration (${selectedMinSec})` : diff > 0 ? `Go shorter (${selectedMinSec})` : `Go longer (${selectedMinSec})`,
    selectedValue: formatDuration(selectedDuration),
    dailyValue: formatDuration(dailyDuration),
    comparison: selectedDuration === dailyDuration ? 'equal' : selectedDuration < dailyDuration ? 'higher' : 'lower',
  };
};

export const truncateGenres = (genres: string, limit: number = 2) => {
  const genreList = genres.split(' ');
  if (genreList.length <= limit) return genres;
  return `${genreList.slice(0, limit).join(' ')} ...`;
};

export const getDetailedSongComparison = async (
  selectedSong: Track & { artists: Artist[]; album: Album },
  dailySong: any,
): Promise<ComparisonResult> => {
  // console.log("getDetailedSongComparison: daily: ", dailySong)
  const selectedYear = new Date(selectedSong.album.release_date || '').getFullYear();
  const dailyYear = new Date(dailySong.album.release_date || '').getFullYear();

  // Assuming we don't have country information, we'll keep it as unknown
  const selectedArtistCountry = "Unknown";
  const dailyArtistCountry = "Unknown";

  // Extract genres directly from the artist information
  // const selectedGenres = removeDuplicates(selectedSongArtists.flatMap(artist => artist.genres));
  // const dailyGenres = removeDuplicates(dailySongArtists.flatMap(artist => artist.genres));

  return {
    [ComparisonKey.Artist]: compareArtists(selectedSong.artists, dailySong.artists),
    [ComparisonKey.Album]: compareAlbums(selectedSong.album, dailySong.album),
    [ComparisonKey.Year]: compareYears(selectedYear, dailyYear),
    [ComparisonKey.Decade]: compareDecades(selectedYear, dailyYear),
    [ComparisonKey.Genre]: compareGenres(selectedSong.Genres, dailySong.genres),
    [ComparisonKey.Popularity]: comparePopularity(selectedSong.popularity!, dailySong.popularity!),
    [ComparisonKey.Duration]: compareDuration(selectedSong.duration_ms, dailySong.duration_ms),
    [ComparisonKey.ArtistCountry]: {
      result: selectedArtistCountry === dailyArtistCountry,
      message: `Artist from ${selectedArtistCountry}`,
      selectedValue: selectedArtistCountry,
      dailyValue: dailyArtistCountry,
    },
  };
};

export const isCorrectGuess = (selectedSong: Track, dailySong: any): boolean => {
  if (selectedSong.id === dailySong.id) return true;
  const nameMatch = selectedSong.name.toLowerCase() === dailySong.name.toLowerCase();
  const artistMatch = selectedSong.artists.some((artist) =>
    dailySong.artists.some((dailyArtist) => dailyArtist.name.toLowerCase() === artist.name.toLowerCase())
  );
  // const durationMatch = Math.abs(selectedSong.duration_ms - dailySong.duration) <= DURATION_THRESHOLD_MS;
  const albumMatch = selectedSong.album.name.toLowerCase() === dailySong.album.name.toLowerCase();

  return nameMatch && artistMatch && albumMatch;
};