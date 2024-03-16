import { PartialType } from '@nestjs/swagger';
import { CreateSubModuleAdminDTO } from './create-sub-modules-admin.dto';

export class UpdateSubModulesAdminDto extends PartialType(
  CreateSubModuleAdminDTO,
) {}
