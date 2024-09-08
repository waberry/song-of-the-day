import { trackType as Song } from "~/types/spotify.types";

// Thresholds for comparison
const DURATION_THRESHOLD_MS = 2000; // 2 seconds
const POPULARITY_THRESHOLD = 10; // On a scale of 0-100

export enum ComparisonKey {
  Artist = 'artist',
  Album = 'album',
  Year = 'year',
  Genre = 'genre',
  Popularity = 'popularity',
  Duration = 'duration',
}

type ComparisonResult = {
  [key in ComparisonKey]: {
    result: boolean;
    message: string;
    selectedValue: string | number;
    dailyValue: string | number;
  };
};

export const getDetailedSongComparison = (selectedSong: Song, dailySong: Song): Promise<ComparisonResult> => {
  const selectedYear = new Date(selectedSong.album.release_date).getFullYear();
  const dailyYear = new Date(dailySong.album.release_date).getFullYear();

  // Fetch genres for both songs (you'll need to implement this function)
  const selectedGenres =  fetchGenresForSong(selectedSong);
  const dailyGenres =  fetchGenresForSong(dailySong);

  return {
    [ComparisonKey.Artist]: {
      result: selectedSong.artists.some(artist => 
        dailySong.artists.some(dailyArtist => dailyArtist.id === artist.id)
      ),
      message: getArtistComparisonMessage(selectedSong.artists, dailySong.artists),
      selectedValue: selectedSong.artists.map(a => a.name).join(', '),
      dailyValue: dailySong.artists.map(a => a.name).join(', '),
    },
    [ComparisonKey.Album]: {
      result: selectedSong.album.id === dailySong.album.id,
      message: `Album: ${selectedSong.album.name}`,
      selectedValue: selectedSong.album.name,
      dailyValue: dailySong.album.name,
    },
    [ComparisonKey.Year]: {
      result: selectedYear === dailyYear,
      message: getYearComparisonMessage(selectedYear, dailyYear),
      selectedValue: selectedYear,
      dailyValue: dailyYear,
    },
    [ComparisonKey.Genre]: {
      result: selectedGenres.some(genre => dailyGenres.includes(genre)),
      message: getGenreComparisonMessage(selectedGenres, dailyGenres),
      selectedValue: selectedGenres.join(', '),
      dailyValue: dailyGenres.join(', '),
    },
    [ComparisonKey.Popularity]: {
      result: Math.abs(selectedSong.popularity - dailySong.popularity) <= POPULARITY_THRESHOLD,
      message: getPopularityComparisonMessage(selectedSong.popularity, dailySong.popularity),
      selectedValue: selectedSong.popularity,
      dailyValue: dailySong.popularity,
    },
    [ComparisonKey.Duration]: {
      result: Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= DURATION_THRESHOLD_MS,
      message: getDurationComparisonMessage(selectedSong.duration_ms, dailySong.duration_ms),
      selectedValue: selectedSong.duration_ms,
      dailyValue: dailySong.duration_ms,
    },
  };
};

const getArtistComparisonMessage = (selectedArtists: Song['artists'], dailyArtists: Song['artists']) => {
  const mainArtist = selectedArtists[0].name;
  const featuring = selectedArtists.slice(1).map(a => a.name).join(', ');
  return featuring ? `${mainArtist} ft. ${featuring}` : mainArtist;
};

const getYearComparisonMessage = (selectedYear: number, dailyYear: number) => {
  if (selectedYear === dailyYear) return `Released in ${selectedYear}`;
  return selectedYear < dailyYear ? `Older (${selectedYear})` : `Newer (${selectedYear})`;
};

const getGenreComparisonMessage = (selectedGenres: string[], dailyGenres: string[]) => {
  return `Genres: ${selectedGenres.join(', ')}`;
};

const getPopularityComparisonMessage = (selectedPopularity: number, dailyPopularity: number) => {
  const diff = selectedPopularity - dailyPopularity;
  if (Math.abs(diff) <= POPULARITY_THRESHOLD) return 'Similar popularity';
  return diff > 0 ? 'More popular' : 'Less popular';
};

const getDurationComparisonMessage = (selectedDuration: number, dailyDuration: number) => {
  const diff = selectedDuration - dailyDuration;
  const selectedMinSec = formatDuration(selectedDuration);
  if (Math.abs(diff) <= DURATION_THRESHOLD_MS) return `Equal duration (${selectedMinSec})`;
  return diff > 0 ? `Longer (${selectedMinSec})` : `Shorter (${selectedMinSec})`;
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${(parseInt(seconds) < 10 ? '0' : '') + seconds}`;
};

// You'll need to implement this function to fetch genres
const fetchGenresForSong = (song: Song): string[] => {
  // Implement genre fetching logic here
  // This might involve making API calls to Spotify or using a genre database
  return []; // Placeholder
};

/**
 * Determines if the selected song is the correct guess.
 * @param selectedSong - The song selected by the user
 * @param dailySong - The daily song to compare against
 * @returns true if it's the correct guess, false otherwise
 */
export const isCorrectGuess = (selectedSong: Song, dailySong: Song): boolean => {
  if (selectedSong.id === dailySong.id) {
    return true;
  }

  const nameMatch =
    selectedSong.name.toLowerCase() === dailySong.name.toLowerCase();
  const artistMatch = selectedSong.artists.some((artist) =>
    dailySong.artists.some(
      (dailyArtist) =>
        dailyArtist.name.toLowerCase() === artist.name.toLowerCase(),
    ),
  );
  const durationMatch =
    Math.abs(selectedSong.duration_ms - dailySong.duration_ms) <= 2000; // 2 seconds tolerance
  const albumMatch =
    selectedSong.album.name.toLowerCase() ===
    dailySong.album.name.toLowerCase();

  return nameMatch && artistMatch && (durationMatch || albumMatch);
};