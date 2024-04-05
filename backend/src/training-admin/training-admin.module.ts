import { Module } from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { TrainingAdminController } from './training-admin.controller';
import { TrainingRepository } from './training.repository';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [TrainingAdminController],
  providers: [TrainingAdminService, TrainingRepository, AwsService],
})
export class TrainingAdminModule {}
