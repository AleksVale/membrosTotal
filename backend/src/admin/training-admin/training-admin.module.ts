import { Module } from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { TrainingAdminController } from './training-admin.controller';
import { TrainingRepository } from './training.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { ModuleRepository } from '../training-modules-admin/modules.repository';
import { SubModuleRepository } from '../sub-modules-admin/sub-modules.repository';

@Module({
  controllers: [TrainingAdminController],
  providers: [
    TrainingAdminService,
    TrainingRepository,
    AwsService,
    ModuleRepository,
    SubModuleRepository,
  ],
})
export class TrainingAdminModule {}
