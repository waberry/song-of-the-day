import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SearchDto } from './dtos/search.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SearchResultDto } from './dtos/searchResult.dto';

@Controller('spotify')
export class SpotifyController {

  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/guess')
  async guess() {
    // ... (your guess logic here)
  }

  @Post('/search')
  @Serialize(SearchDto) // Apply Serialize only for request body
  async search(@Body() body: SearchDto, @Res() res): Promise<SearchResultDto[]> {
    const resp = await this.spotifyService.search(body.searchQuery);
    return res.json(resp); // Transform and send response using interceptor
  }
}
