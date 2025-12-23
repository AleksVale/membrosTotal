import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class GetLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
  ) {}

  async execute(id: string): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    return new LessonResponseDto({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      videoProvider: lesson.videoProvider.getValue(),
      duration: lesson.duration,
      subModuleId: lesson.subModuleId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    });
  }
}
