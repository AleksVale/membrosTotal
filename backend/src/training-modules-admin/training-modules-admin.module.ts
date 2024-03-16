import { Module } from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { TrainingModulesAdminController } from './training-modules-admin.controller';

@Module({
  controllers: [TrainingModulesAdminController],
  providers: [TrainingModulesAdminService],
})
export class TrainingModulesAdminModule {}
