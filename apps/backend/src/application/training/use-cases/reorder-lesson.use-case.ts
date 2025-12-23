import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class ReorderLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(id: string, newOrder: number): Promise<LessonResponseDto> {
    if (newOrder < 1) {
      throw new BadRequestException('Order must be at least 1');
    }

    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    const subModule = await this.subModuleRepository.findById(
      lesson.subModuleId,
    );
    if (!subModule) {
      throw new NotFoundException(
        `SubModule with id "${lesson.subModuleId}" not found`,
      );
    }

    const lessons = await this.lessonRepository.findBySubModuleId(
      lesson.subModuleId,
    );
    if (newOrder > lessons.length) {
      throw new BadRequestException(
        `Invalid order position: ${newOrder}. Must be between 1 and ${lessons.length}`,
      );
    }

    try {
      const updatedLesson = await this.lessonRepository.reorder(id, newOrder);

      return new LessonResponseDto({
        id: updatedLesson.id,
        title: updatedLesson.title,
        description: updatedLesson.description,
        order: updatedLesson.order,
        videoUrl: updatedLesson.videoUrl,
        videoProvider: updatedLesson.videoProvider.getValue(),
        duration: updatedLesson.duration,
        subModuleId: updatedLesson.subModuleId,
        createdAt: updatedLesson.createdAt,
        updatedAt: updatedLesson.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('Invalid order position')) {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }
}
