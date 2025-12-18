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

  // Scalar API Reference - Branded with client colors
  app.use(
    '/api',
    apiReference({
      theme: 'default',
      spec: {
        content: document,
      },
      withDefaultFonts: false,
      configuration: {
        theme: 'default',
        hideModels: false,
        hideDownloadButton: false,
        hideSearch: false,
        customCss: `
          :root {
            /* Client Brand Colors */
            /* Preto (Black): #03051D - Very dark, slightly bluish black */
            /* Azul escuro (Dark blue): #0A0E3F - Deep, rich navy blue */
            /* Azul (Blue): #005792 - Medium, vibrant blue */
            /* Laranja (Orange): #F35F2B - Bright, slightly reddish orange */
            /* Cinza claro (Light gray): #F4F4F4 - Very light, almost white gray */
            
            /* Primary Colors - Client Brand */
            --scalar-color-1: #005792;
            --scalar-color-2: #0A0E3F;
            --scalar-color-3: #F35F2B;
            --scalar-color-accent: #005792;
            
            /* Sidebar Styling - Dark theme using client colors */
            --scalar-sidebar-background-1: #03051D;
            --scalar-sidebar-background-2: #0A0E3F;
            --scalar-sidebar-item-hover-color: #F4F4F4;
            --scalar-sidebar-item-hover-background: rgba(0, 87, 146, 0.15);
            --scalar-sidebar-text-color: #F4F4F4;
            --scalar-sidebar-active-item-color: #005792;
            --scalar-sidebar-active-item-background: rgba(0, 87, 146, 0.25);
            --scalar-sidebar-border-color: rgba(0, 87, 146, 0.3);
            
            /* Button Styling - Using vibrant blue */
            --scalar-button-1: #005792;
            --scalar-button-1-color: #F4F4F4;
            --scalar-button-1-hover: #004075;
            --scalar-button-1-border-radius: 8px;
            
            /* Accent buttons - Orange for secondary actions */
            --scalar-button-2: #F35F2B;
            --scalar-button-2-color: #FFFFFF;
            --scalar-button-2-hover: #D44A1F;
            
            /* Code Block Styling */
            --scalar-color-2-rgb: 10, 14, 63;
            --scalar-color-3-rgb: 243, 95, 43;
            --scalar-color-1-rgb: 0, 87, 146;
            
            /* Background colors */
            --scalar-background-1: #FFFFFF;
            --scalar-background-2: #F4F4F4;
            --scalar-background-3: #03051D;
            
            /* Text colors */
            --scalar-color-ghost: #0A0E3F;
            --scalar-color-muted: rgba(10, 14, 63, 0.7);
            
            /* Typography */
            --scalar-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            --scalar-font-code: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
            
            /* Border Radius */
            --scalar-radius: 8px;
            --scalar-radius-lg: 12px;
            
            /* Shadows with brand color tint */
            --scalar-shadow-1: 0 4px 6px -1px rgba(3, 5, 29, 0.1), 0 2px 4px -1px rgba(3, 5, 29, 0.06);
            --scalar-shadow-2: 0 10px 15px -3px rgba(3, 5, 29, 0.1), 0 4px 6px -2px rgba(3, 5, 29, 0.05);
            
            /* Request/Response badges */
            --scalar-color-green: #005792;
            --scalar-color-yellow: #F35F2B;
            --scalar-color-red: #D44A1F;
          }
          
          /* Custom scrollbar with brand colors */
          .scalar-app ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          .scalar-app ::-webkit-scrollbar-track {
            background: var(--scalar-sidebar-background-1);
          }
          
          .scalar-app ::-webkit-scrollbar-thumb {
            background: var(--scalar-color-1);
            border-radius: 5px;
          }
          
          .scalar-app ::-webkit-scrollbar-thumb:hover {
            background: var(--scalar-color-3);
          }
          
          /* Accent highlights */
          .scalar-app [data-active='true'] {
            border-left-color: #F35F2B !important;
          }
          
          /* Method badges styling */
          .scalar-app .http-verb {
            font-weight: 600;
          }
          
          .scalar-app .http-verb.get {
            background-color: #005792;
            color: #F4F4F4;
          }
          
          .scalar-app .http-verb.post,
          .scalar-app .http-verb.patch,
          .scalar-app .http-verb.put {
            background-color: #F35F2B;
            color: #FFFFFF;
          }
        `,
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
