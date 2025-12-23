import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';

@Injectable()
export class SoftDeleteLessonUseCase {
  constructor(private readonly lessonRepository: LessonRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    if (lesson.isDeleted()) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    await this.lessonRepository.softDelete(id);
  }
}
