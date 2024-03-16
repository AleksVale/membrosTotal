import { PartialType } from '@nestjs/swagger';
import { CreateTrainingAdminDto } from './create-training-admin.dto';

export class UpdateTrainingAdminDto extends PartialType(CreateTrainingAdminDto) {}
