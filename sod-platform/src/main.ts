import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for all routes (adjust if needed)
  await app.listen(5000);
}

bootstrap();
