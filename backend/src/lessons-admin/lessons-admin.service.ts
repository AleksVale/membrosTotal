import { Injectable } from '@nestjs/common';
import { CreateLessonAdminDTO } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';
import { LessonsRepository } from './lessons.repository';

export interface LessonQuery {
  title?: string;
  page: number;
  per_page: number;
  subModuleId: number;
}
@Injectable()
export class LessonsAdminService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}
  create(createLessonsAdminDto: CreateLessonAdminDTO) {
    return this.lessonsRepository.create(createLessonsAdminDto);
  }

  findAll(query: LessonQuery) {
    return this.lessonsRepository.findAll(query);
  }

  findOne(id: number) {
    return this.lessonsRepository.find({ id });
  }

  update(id: number, updateLessonsAdminDto: UpdateLessonsAdminDto) {
    return this.lessonsRepository.update(updateLessonsAdminDto, { id });
  }

  remove(id: number) {
    return this.lessonsRepository.remove({ id });
  }
}
