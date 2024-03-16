import { PartialType } from '@nestjs/swagger';
import { CreateSubModulesAdminDto } from './create-sub-modules-admin.dto';

export class UpdateSubModulesAdminDto extends PartialType(CreateSubModulesAdminDto) {}
