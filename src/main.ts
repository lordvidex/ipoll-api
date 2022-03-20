import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set default version and versioning type
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  // use validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // get the port
  const PORT = app.get(ConfigService).get('PORT') || 3000;

  // listen
  await app.listen(PORT);
}
bootstrap();
