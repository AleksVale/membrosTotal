import { Module } from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { TrainingAdminController } from './training-admin.controller';
import { TrainingRepository } from './training.repository';

@Module({
  controllers: [TrainingAdminController],
  providers: [TrainingAdminService, TrainingRepository],
})
export class TrainingAdminModule {}
