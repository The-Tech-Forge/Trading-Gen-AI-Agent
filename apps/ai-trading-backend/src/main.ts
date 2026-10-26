import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate all incoming request bodies using class-validator decorators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cleanly close the HTTP server on SIGTERM/SIGINT so the port is
  // released before the next hot-reload process tries to bind it.
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
