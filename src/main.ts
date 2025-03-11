import { TransformInterceptor } from '@lib/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';

import { AppModule } from './apps/app.module';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app
    .setGlobalPrefix(globalPrefix)
    .useGlobalInterceptors(new TransformInterceptor())
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Etoubib Api')
    .setDescription('Documentation of Etoubib Api')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
