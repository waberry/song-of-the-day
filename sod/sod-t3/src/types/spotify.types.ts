export type artistType = {
  external_urls: {
    spotify: string;
  };
  followers: { href: string; total: number };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      height: 640;
      url: string;
      width: 640;
    },
    {
      height: 320;
      url: string;
      width: 320;
    },
    {
      height: 160;
      url: string;
      width: 160;
    },
  ];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type miniArtistType = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type trackType = {
  album: {
    album_type: string;
    artists: miniArtistType[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: [
      {
        height: 640;
        url: string;
        width: 640;
      },
      {
        height: 300;
        url: string;
        width: 300;
      },
      {
        height: 64;
        url: string;
        width: 64;
      },
    ];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  };
  artists: miniArtistType[];
  available_markets: string;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

export type paginatedResponse<T> = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: T;
};

export const keysByNumber = [
  "C",
  "C#/D♭",
  "D",
  "D#/E♭",
  "E",
  "F",
  "F#/G♭",
  "G",
  "G#/A♭",
  "A",
  "A#/B♭",
  "B",
];

export const modeByNumber = ["Minor", "Major"];

export type audioFeaturesType = {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: string;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
};

export type recentPlayedResponse = {
  items: {
    track: trackType;
    played_at: string;
    context: {
      type: string;
      external_urls: {
        spotify: string;
      };
      href: string;
      uri: string;
    };
  }[];
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
};

export type playlistType = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [
    {
      height: 640;
      url: string;
      width: 640;
    },
    {
      height: 300;
      url: string;
      width: 300;
    },
    {
      height: 60;
      url: string;
      width: 60;
    },
  ];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

export type playlistTracksRes = {
  href: string;
  items: playlistItemType[];
  limit: number;
  next: number;
  offset: number;
  previous: number;
  total: number;
};

export type playlistItemType = {
  added_at: string;
  added_by: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string;
  track: trackType & {
    episode: boolean;
    preview_url: string;
    external_ids: { isrc: string };
  };
  video_thumbnail: { url: string };
};

export type spotifyUserType = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: 0;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
};
