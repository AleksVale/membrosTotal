import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env, envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { UserModule as CollaboratorUserModule } from './collaborator/user/user.module';
import { MeetingsModule as ColaboratorMeetingsModule } from './collaborator/meetings/meetings.module';
import { PaymentsModule } from './collaborator/payments/payments.module';
import { PaymentAdminModule } from './payment-admin/payment-admin.module';
import { AwsModule } from './aws/aws.module';
import { PaymentRequestAdminModule } from './payment-request-admin/payment-request-admin.module';
import { PaymentRequestModule } from './collaborator/payment-request/payment-request.module';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    AuthModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    MeetingsModule,
    PrismaModule,
    CollaboratorUserModule,
    ColaboratorMeetingsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para que o ConfigService esteja disponível
      inject: [ConfigService], // Injeta o ConfigService
      useFactory: async (configService: ConfigService<Env, true>) => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get<string>('MAILER_USERNAME'),
            pass: configService.get<string>('MAILER_PASSWORD'), // Use o ConfigService para obter a senha do e-mail
          },
        },
      }),
    }),
    AutocompleteModule,
    PaymentsModule,
    PaymentAdminModule,
    AwsModule,
    PaymentRequestAdminModule,
    PaymentRequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
