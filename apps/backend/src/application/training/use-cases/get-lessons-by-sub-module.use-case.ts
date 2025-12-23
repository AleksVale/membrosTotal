import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class GetLessonsBySubModuleUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(subModuleId: string): Promise<LessonResponseDto[]> {
    const subModule = await this.subModuleRepository.findById(subModuleId);
    if (!subModule) {
      throw new NotFoundException(
        `SubModule with id "${subModuleId}" not found`,
      );
    }

    const lessons = await this.lessonRepository.findBySubModuleId(subModuleId);

    return lessons.map(
      (lesson) =>
        new LessonResponseDto({
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
        }),
    );
  }
}
