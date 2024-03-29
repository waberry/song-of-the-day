import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';

@Module({
  imports: [HttpModule],
  providers: [SpotifyService],
  exports: [SpotifyService],
  controllers: [SpotifyController],
})
export class SpotifyModule {}
