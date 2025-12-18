import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupDocumentation(app: INestApplication): void {
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

  app.use(
    '/api',
    apiReference({
      theme: 'mars',
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
}
