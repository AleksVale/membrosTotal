import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  const configService = app.get<ConfigService<EnvConfig, true>>(ConfigService);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://unpkg.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://unpkg.com',
          ],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: configService.getOrThrow('FRONTEND_URL'),
    credentials: true,
  });

  // Swagger/OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Membros Total API')
    .setDescription('API documentation for Membros Total application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Scalar API Reference
  app.use(
    '/api',
    apiReference({
      theme: 'default',
      spec: {
        content: document,
      },
      configuration: {
        theme: 'default',
        hideModels: false,
        hideDownloadButton: false,
        hideSearch: false,
      },
    }),
  );

  const port = configService.getOrThrow('PORT');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Scalar API documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
