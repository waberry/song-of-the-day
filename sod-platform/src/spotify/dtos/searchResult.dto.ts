import { Expose, Transform } from 'class-transformer';

interface Artist {
  name: string;
  uri?: string; // Optional artist URI
}

interface Album {
  name: string;
  uri?: string; // Optional album URI
  images?: Image[]; // Optional array of image objects
}

interface Image {
  height: number;
  url: string;
  width: number;
}

export class SearchResultDto {
  @Expose()
  @Transform(({ value }) => value.name.toLowerCase()) // Transform to lowercase
  name: string; // Track name

  @Expose()
  artists?: Artist[]; // Array of artist objects

  @Expose()
  album?: Album; // Album object

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : value)) // Transform to lowercase or handle null
  type: string; // Track type (e.g., "track")

  @Expose()
  preview_url?: string; // Optional preview URL

  @Expose()
  uri?: string; // Optional track URI
}
