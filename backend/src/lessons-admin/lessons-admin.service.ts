import { Injectable } from '@nestjs/common';
import { CreateLessonAdminDTO } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsAdminService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}
  create(createLessonsAdminDto: CreateLessonAdminDTO) {
    return this.lessonsRepository.create(createLessonsAdminDto);
  }

  findAll() {
    return `This action returns all lessonsAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonsAdmin`;
  }

  update(id: number, updateLessonsAdminDto: UpdateLessonsAdminDto) {
    return `This action updates a #${id} lessonsAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonsAdmin`;
  }
}
