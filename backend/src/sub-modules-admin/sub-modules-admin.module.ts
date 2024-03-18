import { Module } from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { SubModulesAdminController } from './sub-modules-admin.controller';
import { SubModuleRepository } from './sub-modules.repository';

@Module({
  controllers: [SubModulesAdminController],
  providers: [SubModulesAdminService, SubModuleRepository],
})
export class SubModulesAdminModule {}
