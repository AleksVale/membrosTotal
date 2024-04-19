import { Module } from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { TrainingModulesAdminController } from './training-modules-admin.controller';
import { ModuleRepository } from './modules.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { TrainingRepository } from 'src/admin/training-admin/training.repository';
import { SubModuleRepository } from '../sub-modules-admin/sub-modules.repository';

@Module({
  controllers: [TrainingModulesAdminController],
  providers: [
    TrainingModulesAdminService,
    ModuleRepository,
    AwsService,
    TrainingRepository,
    SubModuleRepository,
  ],
})
export class TrainingModulesAdminModule {}
