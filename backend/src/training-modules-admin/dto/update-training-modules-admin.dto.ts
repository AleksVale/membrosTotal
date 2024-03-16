import { PartialType } from '@nestjs/swagger';
import { CreateTrainingModulesAdminDto } from './create-training-modules-admin.dto';

export class UpdateTrainingModulesAdminDto extends PartialType(CreateTrainingModulesAdminDto) {}
