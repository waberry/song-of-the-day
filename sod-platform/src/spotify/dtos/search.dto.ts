// import { ItemTypes } from '@spotify/web-api-ts-sdk';
import { Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class SearchDto {
  @Expose()
  @IsString()
  searchQuery: string;

  @Expose()
  @IsOptional()
  type: [];
}