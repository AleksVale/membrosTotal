import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class CreateLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(
    subModuleId: string,
    createDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    const subModule = await this.subModuleRepository.findById(subModuleId);
    if (!subModule) {
      throw new NotFoundException(
        `SubModule with id "${subModuleId}" not found`,
      );
    }

    const orderExists =
      await this.lessonRepository.existsByOrderAndSubModuleId(
        createDto.order,
        subModuleId,
      );
    if (orderExists) {
      throw new ConflictException(
        `A lesson with order ${createDto.order} already exists in this submodule`,
      );
    }

    const lesson = await this.lessonRepository.create({
      title: createDto.title,
      description: createDto.description ?? null,
      order: createDto.order,
      videoUrl: createDto.videoUrl ?? null,
      videoProvider: createDto.videoProvider,
      duration: createDto.duration,
      subModuleId: createDto.subModuleId,
    });

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
