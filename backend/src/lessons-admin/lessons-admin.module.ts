import { Module } from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { LessonsAdminController } from './lessons-admin.controller';

@Module({
  controllers: [LessonsAdminController],
  providers: [LessonsAdminService],
})
export class LessonsAdminModule {}
