import { Injectable } from '@nestjs/common';
import { SpotifyService } from './spotify/spotify.service';

@Injectable()
export class AppService {
  private spotify: SpotifyService;

  getHello(): string {
    return 'Hello World!';
  }
}
