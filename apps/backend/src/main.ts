import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupDocumentation } from './config/documentation.config';
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

  // Setup API Documentation
  setupDocumentation(app);

  const port = configService.getOrThrow('PORT');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Scalar API documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
