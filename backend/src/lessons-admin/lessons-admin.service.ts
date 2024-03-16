import { Injectable } from '@nestjs/common';
import { CreateLessonsAdminDto } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';

@Injectable()
export class LessonsAdminService {
  create(createLessonsAdminDto: CreateLessonsAdminDto) {
    return 'This action adds a new lessonsAdmin';
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
