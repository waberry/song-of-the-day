//todo centralise all types and interfaces
export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface Item {
  album: {};
  artists: {};
}
export interface Items {
  list: Item[];
}

export interface SpotifyItem {
  images?: SpotifyImage[];
  album?: {
    images?: SpotifyImage[];
  };
}

export type ImageSize = "small" | "medium" | "large";

export interface DataTypeStylesLookup {
  [key: string]: {
    labelPlural: string;
    labelSingular: string;
    buttonDark: string;
    buttonDarkHover: string;
  };
}

export interface Artist {
  name: string;
  // Add other properties if needed
}

export interface Album {
  name: string;
  release_date: string;
  total_tracks: number;
  artists: Artist[];
  // Add other properties if needed
}

export interface TrackData {
  album: Album;
  duration_ms: number;
  track_number: number;
  // Add other properties if needed
}

export interface BodyTrackProps {
  data: TrackData;
}
