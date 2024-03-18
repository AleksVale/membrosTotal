import { PartialType } from '@nestjs/swagger';
import { CreateModuleAdminDTO } from './create-training-modules-admin.dto';

export class UpdateTrainingModulesAdminDto extends PartialType(
  CreateModuleAdminDTO,
) {}
