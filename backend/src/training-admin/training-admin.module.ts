import { Module } from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { TrainingAdminController } from './training-admin.controller';

@Module({
  controllers: [TrainingAdminController],
  providers: [TrainingAdminService],
})
export class TrainingAdminModule {}
