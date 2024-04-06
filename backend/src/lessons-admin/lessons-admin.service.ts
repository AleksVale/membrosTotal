import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonAdminDTO } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';
import { LessonsRepository } from './lessons.repository';
import { AwsService } from 'src/aws/aws.service';

export interface LessonQuery {
  title?: string;
  page: number;
  per_page: number;
  subModuleId?: number;
}
@Injectable()
export class LessonsAdminService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly awsService: AwsService,
  ) {}
  create(createLessonsAdminDto: CreateLessonAdminDTO) {
    return this.lessonsRepository.create(createLessonsAdminDto);
  }

  async createFile(file: Express.Multer.File, lessonId: number) {
    const lesson = await this.lessonsRepository.find({ id: lessonId });
    const thumbnail = lesson?.thumbnail
      ? lesson.thumbnail
      : this.awsService.createPhotoKeyLesson(
          lessonId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, thumbnail);
    return this.lessonsRepository.update({ thumbnail }, { id: lessonId });
  }

  findAll(query: LessonQuery) {
    return this.lessonsRepository.findAll(query);
  }

  async findOne(id: number) {
    const lesson = await this.lessonsRepository.find({ id });
    if (!lesson) throw new NotFoundException('ID inválido');
    const photo = await this.awsService.getPhoto(lesson.thumbnail as string);
    return { lesson, stream: photo };
  }

  update(id: number, updateLessonsAdminDto: UpdateLessonsAdminDto) {
    const entity = { ...updateLessonsAdminDto, file: undefined };
    return this.lessonsRepository.update(entity, { id });
  }

  remove(id: number) {
    return this.lessonsRepository.remove({ id });
  }
}
