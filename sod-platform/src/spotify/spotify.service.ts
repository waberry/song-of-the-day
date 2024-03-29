import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Base64 } from 'js-base64';
import * as qs from 'qs';

export enum MUSIC_SEARCH_TYPE {
  ALBUM = 'album',
  ARTIST = 'artist',
}

export abstract class MusicSearchService {
  abstract search(query: string): Promise<any>;
  // abstract searchPlaylists(query: string): Promise<any>;

  // abstract mapAlbumsResponse(response: any): Album[];
}

class Album {
  title: string;
  year: string;
  artworkUrl: string;
}

class Artist {
  name: string;
  pictureUrl: string;
}

class Playlist {
  title: string;
  artworkUrl: string;
}

const SPOTIFY_SEARCH_API = 'https://api.spotify.com/v1/search';
const SPOTIFY_ACCOUNT_API = 'https://accounts.spotify.com/api/token';

@Injectable()
export class SpotifyService extends MusicSearchService {
  private ACCESS_TOKEN: string;
  private readonly http = axios.create();

  constructor() {
    super();
  }

  private async requestAccessToken(): Promise<string> {
    const auth = Base64.encode(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    );
    const data = qs.stringify({ grant_type: 'client_credentials' });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    };

    const response = await this.http.post(SPOTIFY_ACCOUNT_API, data, {
      headers,
    });
    this.ACCESS_TOKEN = response.data.access_token;
    return response.data.access_token;
  }

  async getAccessToken(): Promise<string> {
    if (!this.ACCESS_TOKEN) {
      this.ACCESS_TOKEN = await this.requestAccessToken();
    }
    return this.ACCESS_TOKEN;
  }

  // filters: Artist Year( range or single year)
  async search(query: string): Promise<Album[]> {
    const token = await this.getAccessToken();

    const queryParam = query.toLowerCase().replace(' ', '%20');
    const typeParam = 'track';
    const url = `${SPOTIFY_SEARCH_API}?q="${queryParam}"&type=${typeParam}`;

    const response = await this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // mapAlbumsResponse(response: any): Album[] {
  //   const albums: Album[] = [];
  //   try {
  //     const responseData = response.tracks.items as any[];

  //     responseData.forEach((dataObject) => {
  //       albums.push({
  //         title: dataObject['name'],
  //         year: dataObject['release_date'],
  //         artworkUrl:
  //           dataObject['images'] && dataObject['images'][1]
  //             ? dataObject['images'][1]['url']
  //             : '',
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Error processing album data:', error);
  //   }
  //   return albums;
  // }
}
