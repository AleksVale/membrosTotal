import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { VideoProvider } from '../../../domain/training/value-objects/video-provider.vo';
import { LessonResponseDto } from '../dto/lesson-response.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

@Injectable()
export class UpdateLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(
    id: string,
    updateDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    if (lesson.isDeleted()) {
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

    if (updateDto.order !== undefined && updateDto.order !== lesson.order) {
      const orderExists =
        await this.lessonRepository.existsByOrderAndSubModuleId(
          updateDto.order,
          lesson.subModuleId,
        );
      if (orderExists) {
        throw new ConflictException(
          `A lesson with order ${updateDto.order} already exists in this submodule`,
        );
      }
    }

    let updatedLesson = lesson.update({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
      videoUrl: updateDto.videoUrl,
      duration: updateDto.duration,
    });

    if (updateDto.videoProvider) {
      updatedLesson = updatedLesson.updateVideoProvider(
        new VideoProvider(updateDto.videoProvider),
      );
    }

    const savedLesson = await this.lessonRepository.update(id, updatedLesson);

    return new LessonResponseDto({
      id: savedLesson.id,
      title: savedLesson.title,
      description: savedLesson.description,
      order: savedLesson.order,
      videoUrl: savedLesson.videoUrl,
      videoProvider: savedLesson.videoProvider.getValue(),
      duration: savedLesson.duration,
      subModuleId: savedLesson.subModuleId,
      createdAt: savedLesson.createdAt,
      updatedAt: savedLesson.updatedAt,
    });
  }
}
