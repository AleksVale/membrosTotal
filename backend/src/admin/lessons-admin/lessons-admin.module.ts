import { Module } from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { LessonsAdminController } from './lessons-admin.controller';
import { LessonsRepository } from './lessons.repository';
import { AwsService } from 'src/common/aws/aws.service';

@Module({
  controllers: [LessonsAdminController],
  providers: [LessonsAdminService, LessonsRepository, AwsService],
})
export class LessonsAdminModule {}
