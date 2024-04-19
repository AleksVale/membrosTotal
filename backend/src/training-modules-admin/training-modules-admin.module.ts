import { Module } from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { TrainingModulesAdminController } from './training-modules-admin.controller';
import { ModuleRepository } from './modules.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { TrainingRepository } from 'src/training-admin/training.repository';

@Module({
  controllers: [TrainingModulesAdminController],
  providers: [
    TrainingModulesAdminService,
    ModuleRepository,
    AwsService,
    TrainingRepository,
  ],
})
export class TrainingModulesAdminModule {}
