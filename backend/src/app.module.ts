import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { PrismaModule } from './prisma/prisma.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { UserModule as CollaboratorUserModule } from './collaborator/user/user.module';
import { MeetingsModule as ColaboratorMeetingsModule } from './collaborator/meetings/meetings.module';
import { PaymentsModule } from './collaborator/payments/payments.module';
import { PaymentAdminModule } from './payment-admin/payment-admin.module';

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
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     auth: {
    //       user: 'undefined',
    //       pass: 'undefined',
    //     },
    //   },
    //   template: {
    //     dir: __dirname + '/templates',
    //     adapter: new PugAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    AutocompleteModule,
    PaymentsModule,
    PaymentAdminModule,
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
