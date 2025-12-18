import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth';
import { envValidationSchema } from './config/env.validation';
import { PresentationAuthModule } from './presentation/auth/auth.module';
import { PresentationTrainingModule } from './presentation/training/training.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true, // Allow unknown env variables
        abortEarly: false, // Return all validation errors, not just the first one
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window in milliseconds (60 seconds)
        limit: 10, // Maximum number of requests per window
      },
    ]),
    AuthModule.forRoot({ auth }),
    PrismaModule,
    PresentationAuthModule,
    PresentationTrainingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
