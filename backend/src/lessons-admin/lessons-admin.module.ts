import { Module } from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { LessonsAdminController } from './lessons-admin.controller';
import { LessonsRepository } from './lessons.repository';

@Module({
  controllers: [LessonsAdminController],
  providers: [LessonsAdminService, LessonsRepository],
})
export class LessonsAdminModule {}
