import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class SwapLessonOrdersUseCase {
  constructor(private readonly lessonRepository: LessonRepositoryInterface) {}

  async execute(
    id1: string,
    id2: string,
  ): Promise<[LessonResponseDto, LessonResponseDto]> {
    const lesson1 = await this.lessonRepository.findById(id1);
    if (!lesson1) {
      throw new NotFoundException(`Lesson with id "${id1}" not found`);
    }

    const lesson2 = await this.lessonRepository.findById(id2);
    if (!lesson2) {
      throw new NotFoundException(`Lesson with id "${id2}" not found`);
    }

    if (lesson1.subModuleId !== lesson2.subModuleId) {
      throw new ConflictException(
        `Lessons must belong to the same submodule. Lesson ${id1} belongs to subModule ${lesson1.subModuleId}, lesson ${id2} belongs to subModule ${lesson2.subModuleId}`,
      );
    }

    try {
      await this.lessonRepository.swapOrders(id1, id2);

      const updated1 = await this.lessonRepository.findById(id1);
      const updated2 = await this.lessonRepository.findById(id2);

      if (!updated1 || !updated2) {
        throw new NotFoundException('Failed to retrieve updated lessons');
      }

      return [
        new LessonResponseDto({
          id: updated1.id,
          title: updated1.title,
          description: updated1.description,
          order: updated1.order,
          videoUrl: updated1.videoUrl,
          videoProvider: updated1.videoProvider.getValue(),
          duration: updated1.duration,
          subModuleId: updated1.subModuleId,
          createdAt: updated1.createdAt,
          updatedAt: updated1.updatedAt,
        }),
        new LessonResponseDto({
          id: updated2.id,
          title: updated2.title,
          description: updated2.description,
          order: updated2.order,
          videoUrl: updated2.videoUrl,
          videoProvider: updated2.videoProvider.getValue(),
          duration: updated2.duration,
          subModuleId: updated2.subModuleId,
          createdAt: updated2.createdAt,
          updatedAt: updated2.updatedAt,
        }),
      ];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('must belong to the same submodule')) {
          throw new ConflictException(error.message);
        }
      }
      throw error;
    }
  }
}
