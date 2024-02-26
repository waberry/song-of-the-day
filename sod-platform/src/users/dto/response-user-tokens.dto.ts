import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDate, isDate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

//todo extend PartialType to add this param: OmitType(User, ['playlists'] as const)
export class ResUserTokensDto {
  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
