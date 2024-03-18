import { Module } from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { TrainingModulesAdminController } from './training-modules-admin.controller';
import { ModuleRepository } from './modules.repository';

@Module({
  controllers: [TrainingModulesAdminController],
  providers: [TrainingModulesAdminService, ModuleRepository],
})
export class TrainingModulesAdminModule {}
