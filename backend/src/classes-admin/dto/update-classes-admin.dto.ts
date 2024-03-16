import { PartialType } from '@nestjs/swagger';
import { CreateClassesAdminDto } from './create-classes-admin.dto';

export class UpdateClassesAdminDto extends PartialType(CreateClassesAdminDto) {}
