import { Module } from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { TrainingModulesAdminController } from './training-modules-admin.controller';
import { ModuleRepository } from './modules.repository';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [TrainingModulesAdminController],
  providers: [TrainingModulesAdminService, ModuleRepository, AwsService],
})
export class TrainingModulesAdminModule {}
