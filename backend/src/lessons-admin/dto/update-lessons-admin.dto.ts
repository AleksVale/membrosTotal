import { PartialType } from '@nestjs/swagger';
import { CreateLessonsAdminDto } from './create-lessons-admin.dto';

export class UpdateLessonsAdminDto extends PartialType(CreateLessonsAdminDto) {}
