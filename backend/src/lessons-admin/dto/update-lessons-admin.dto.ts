import { PartialType } from '@nestjs/swagger';
import { CreateLessonAdminDTO } from './create-lessons-admin.dto';

export class UpdateLessonsAdminDto extends PartialType(CreateLessonAdminDTO) {}
