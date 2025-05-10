import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './admin/user/user.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './public/auth/auth.module';
import { MeetingsModule } from './admin/meetings/meetings.module';
import { PrismaModule } from './prisma/prisma.module';
import { AutocompleteModule } from './public/autocomplete/autocomplete.module';
import { UserModule as CollaboratorUserModule } from './collaborator/user/user.module';
import { MeetingsModule as ColaboratorMeetingsModule } from './collaborator/meetings/meetings.module';
import { PaymentsModule } from './collaborator/payments/payments.module';
import { PaymentAdminModule } from './admin/payment-admin/payment-admin.module';
import { AwsModule } from './common/aws/aws.module';
import { PaymentRequestAdminModule } from './admin/payment-request-admin/payment-request-admin.module';
import { PaymentRequestModule } from './collaborator/payment-request/payment-request.module';
import { RefundsModule } from './collaborator/refund/refunds.module';
import { TrainingAdminModule } from './admin/training-admin/training-admin.module';
import { TrainingModulesAdminModule } from './admin/training-modules-admin/training-modules-admin.module';
import { SubModulesAdminModule } from './admin/sub-modules-admin/sub-modules-admin.module';
import { LessonsAdminModule } from './admin/lessons-admin/lessons-admin.module';
import { RefundAdminModule } from './admin/refund-admin/refund-admin.module';
import { TrainingCollaboratorModule } from './collaborator/training-collaborator/training-collaborator.module';
import { ExpertRequestModule } from './admin/expert-request/expert-request.module';
import { HomeModule } from './collaborator/home/home.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AdminNotificationModule } from './admin/admin-notification/admin-notification.module';
import { CollaboratorNotificationModule } from './collaborator/collaborator-notification/collaborator-notification.module';
import { LessonCollaboratorModule } from './collaborator/lessons-collaborator/lessons-collaborator.module';
import { ModuleCollaboratorModule } from './collaborator/modules-collaborator/modules-collaborator.module';
import { SubmoduleCollaboratorModule } from './collaborator/submodules-collaborator/submodules-collaborator.module';
import { PublicExpertRequestModule } from './public/expert-request/public-expert-request.module';
import { UtmParamModule } from './public/utm-param/utm-param.module';

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
    AutocompleteModule,
    PaymentsModule,
    PaymentAdminModule,
    AwsModule,
    PaymentRequestAdminModule,
    PaymentRequestModule,
    RefundsModule,
    TrainingAdminModule,
    TrainingModulesAdminModule,
    SubModulesAdminModule,
    LessonsAdminModule,
    RefundAdminModule,
    TrainingCollaboratorModule,
    ModuleCollaboratorModule,
    SubmoduleCollaboratorModule,
    LessonCollaboratorModule,
    ExpertRequestModule,
    PublicExpertRequestModule,
    HomeModule,
    AdminNotificationModule,
    CollaboratorNotificationModule,
    UtmParamModule,
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
