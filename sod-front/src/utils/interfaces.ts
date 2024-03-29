export interface SpotifyTracksResponse {
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[];
  };
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: { reason: string };
  type: string;
  uri: string;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string; ean: string; upc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: any;
  restrictions: { reason: string };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface SpotifyPlaylistOwner {
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface SpotifyPlaylistTrack {
  href: string;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyPlaylistOwner;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTrack;
  type: string;
  uri: string;
}

export interface SpotifyShow {
  available_markets: string[];
  copyrights: { text: string; type: string }[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
}

export interface SpotifyEpisode {
  audio_preview_url: string;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: { fully_played: boolean; resume_position_ms: number };
  type: string;
  uri: string;
  restrictions: { reason: string };
}

export interface SpotifyAudiobookAuthor {
  name: string;
}

export interface SpotifyAudiobook {
  authors: SpotifyAudiobookAuthor[];
  available_markets: string[];
  copyrights: { text: string; type: string }[];
  description: string;
  html_description: string;
  edition: string;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  languages: string[];
  media_type: string;
  name: string;
  narrators: SpotifyAudiobookAuthor[];
  publisher: string;
  type: string;
  uri: string;
  total_chapters: number;
}
