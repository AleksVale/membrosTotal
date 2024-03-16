import { Module } from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { SubModulesAdminController } from './sub-modules-admin.controller';

@Module({
  controllers: [SubModulesAdminController],
  providers: [SubModulesAdminService],
})
export class SubModulesAdminModule {}
