import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

import { SearchResultDto } from 'src/spotify/dtos/searchResult.dto'; 

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: any) => {
        // Transformation using DTO
        if (this.dto) {
          return plainToClass(this.dto, data, {
            excludeExtraneousValues: true, // Omit unexpected properties
          });
        }

        // Fallback: Return data as-is if no DTO provided
        return data;
      })
    );
  }
}
