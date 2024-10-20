import axios, { AxiosInstance } from 'axios';

interface ArtistInfo {
  id: string;
  name: string;
  country: string | null;
  type: string | null;
  gender: string | null;
  lifeSpan: {
    begin: string | null;
    end: string | null;
  };
  genres: string[];
}

interface ReleaseInfo {
  id: string;
  title: string;
  artistCredit: string;
  date: string | null;
  country: string | null;
  trackCount: number;
}

interface RecordingInfo {
  id: string;
  title: string;
  artistCredit: string;
  duration: number | null;
  releases: {
    id: string;
    title: string;
    date: string | null;
  }[];
}

class MusicBrainzService {
  private api: AxiosInstance;
  private readonly baseURL = 'https://musicbrainz.org/ws/2';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      params: {
        fmt: 'json',
      },
      headers: {
        'User-Agent': 'YourAppName/1.0.0 ( your@email.com )', // Replace with your app info
      },
    });
  }

  private async query(endpoint: string, params: Record<string, any>) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`Error querying MusicBrainz (${endpoint}):`, error);
      return null;
    }
  }

  async getArtistsInfo(artistNames: string | string[]): Promise<ArtistInfo[]> {
    const names = Array.isArray(artistNames) ? artistNames : [artistNames];
    const results: ArtistInfo[] = [];

    for (const name of names) {
      const data = await this.query('/artist', { query: name });
      if (data && data.artists && data.artists.length > 0) {
        const artist = data.artists[0];
        results.push({
          id: artist.id,
          name: artist.name,
          country: artist.country || artist.area?.name || null,
          type: artist.type || null,
          gender: artist.gender || null,
          lifeSpan: {
            begin: artist['life-span']?.begin || null,
            end: artist['life-span']?.end || null,
          },
          genres: artist.genres?.map(g => g.name) || [],
        });
      }
    }

    return results;
  }

  async getReleasesInfo(releaseName: string, artistNames?: string | string[]): Promise<ReleaseInfo[]> {
    let query = `release:"${releaseName}"`;
    if (artistNames) {
      const artists = Array.isArray(artistNames) ? artistNames : [artistNames];
      query += ` AND artist:(${artists.map(a => `"${a}"`).join(' OR ')})`;
    }
    
    const data = await this.query('/release', { query, inc: 'artist-credits+labels+recordings' });
    if (data && data.releases) {
      return data.releases.map(release => ({
        id: release.id,
        title: release.title,
        artistCredit: release['artist-credit'].map(ac => ac.name).join(' '),
        date: release.date || null,
        country: release.country || null,
        trackCount: release['track-count'] || 0,
      }));
    }
    return [];
  }

  async getRecordingsInfo(trackName: string, artistNames?: string | string[]): Promise<RecordingInfo[]> {
    let query = `recording:"${trackName}"`;
    if (artistNames) {
      const artists = Array.isArray(artistNames) ? artistNames : [artistNames];
      query += ` AND artist:(${artists.map(a => `"${a}"`).join(' OR ')})`;
    }
    
    const data = await this.query('/recording', { query, inc: 'artist-credits+releases' });
    if (data && data.recordings) {
      return data.recordings.map(recording => ({
        id: recording.id,
        title: recording.title,
        artistCredit: recording['artist-credit'].map(ac => ac.name).join(' '),
        duration: recording.length || null,
        releases: (recording.releases || []).map(r => ({
          id: r.id,
          title: r.title,
          date: r.date || null,
        })),
      }));
    }
    return [];
  }

  async getArtistsReleases(artistIds: string | string[], limit: number = 10): Promise<ReleaseInfo[]> {
    const ids = Array.isArray(artistIds) ? artistIds : [artistIds];
    const results: ReleaseInfo[] = [];

    for (const id of ids) {
      const data = await this.query('/release', { artist: id, limit, inc: 'recordings' });
      if (data && data.releases) {
        results.push(...data.releases.map(release => ({
          id: release.id,
          title: release.title,
          artistCredit: release['artist-credit'].map(ac => ac.name).join(' '),
          date: release.date || null,
          country: release.country || null,
          trackCount: release['track-count'] || 0,
        })));
      }
    }

    return results;
  }
}

// Usage example
const musicBrainz = new MusicBrainzService();



export default musicBrainz;