export type SpotifySong = {
    id: string;           // Spotify track ID
    name: string;         // Track name
    artist: string;       // Artist name
    album?: string;       // Album name
    albumArt?: string;    // Album cover URL
    previewUrl?: string;  // 30-second preview URL
    duration?: number;    // Track duration in milliseconds
    popularity?: number;  // Spotify popularity score
    uri?: string;         // Spotify URI
  };
  
  // Optional additional types we might need later:
  export type SpotifyArtist = {
    id: string;
    name: string;
    genres?: string[];
  };
  
  export type SpotifyAlbum = {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    releaseDate?: string;
  };