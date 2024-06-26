import { Module } from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { SubModulesAdminController } from './sub-modules-admin.controller';
import { SubModuleRepository } from './sub-modules.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { TrainingRepository } from 'src/admin/training-admin/training.repository';

@Module({
  controllers: [SubModulesAdminController],
  providers: [
    SubModulesAdminService,
    SubModuleRepository,
    AwsService,
    TrainingRepository,
  ],
})
export class SubModulesAdminModule {}
