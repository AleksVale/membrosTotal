import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  patchNestJsSwagger();

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Area API')
    .setDescription('Uma api para uma área de membros')
    .setVersion('1.0')
    .setBasePath('/api')
    .addTag('MEMBROS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api');
  const port = configService.get('PORT', { infer: true });
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
