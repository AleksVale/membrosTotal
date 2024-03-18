import { PartialType } from '@nestjs/swagger';
import { CreateTrainingAdminDTO } from './create-training-admin.dto';

export class UpdateTrainingAdminDto extends PartialType(
  CreateTrainingAdminDTO,
) {}
