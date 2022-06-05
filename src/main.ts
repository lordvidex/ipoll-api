import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set default version and versioning type
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  // use validation pipes
  app.useGlobalPipes(new ValidationPipe());


  const config = new DocumentBuilder()
    .setTitle('iPoll')
    .setDescription('iPoll API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // get the port
  const PORT = app.get(ConfigService).get('PORT') || 3000;

  // listen
  await app.listen(PORT);
}
bootstrap();
