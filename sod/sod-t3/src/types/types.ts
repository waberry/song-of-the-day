import { DefaultSession } from "next-auth";
import { trackType as Song } from "./spotify.types";

interface MyUser {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;
}

export interface MySession extends Omit<DefaultSession, "user"> {
  user?: MyUser;
  expires: string;
}

interface Image {
  height: number | null;
  url: string | null;
  width: number | null;
}

export interface Album {
  id: string;
  name: string;
  artists: [Artist];
  images?: [Image];
  album_type?: string;
  release_date?: string;
  tracks?: {
    total: number;
    items: Track[];
  };
}

export interface Artist {
  id: string;
  name: string;
  images?: [Image];
  followers?: {
    total: number;
  };
  genres?: [string];
}

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: [Artist];
  duration_ms: number;
  preview_url: string;
}

export interface PlaylistType {
  description?: string;
  id: string;
  followers?: {
    total?: number;
  };
  images?: [Image];
  name: string;
  owner?: {
    id: string;
    display_name?: string;
  };
  items?: [{ added_at: string; track: Track }];
  tracks?: {
    items?: [{ added_at: string; track: Track }];
    total: number;
  };
  type?: string;
  total?: number;
}

export interface SearchResults {
  albums?: {
    items: Album[];
  };
  artists?: {
    items: Artist[];
  };
  playlists?: {
    items: PlaylistType[];
  };
  tracks?: {
    items: Track[];
  };
}

export interface SongWithGenres extends Song {
  Genres?: string[];
  comparison: Record<string, ComparisonResult>;
}

export interface ComparisonResult {
  result: boolean;
  dailyValue: string | string[];
  selectedValue: string | string[];
  comparison?: 'higher' | 'lower';
}

export interface GameState {
  id?: number;  // Optional because it's auto-generated
  anonymousUserId: string;
  pickedSongs: SongWithGenres[];
  dailySongFound: boolean;
  guessState: {
    guessedCorrectly: boolean;
    attempts: number;
  };
  lastResetDate: Date;
}

export interface CommonGameState {
  id?: number;
  lastResetDate: Date;
}