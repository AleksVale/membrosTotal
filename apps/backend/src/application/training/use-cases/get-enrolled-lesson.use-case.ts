import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { LessonRepositoryInterface } from '../../../domain/training/repositories/lesson.repository.interface';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { LessonResponseDto } from '../dto/lesson-response.dto';

@Injectable()
export class GetEnrolledLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
  ) {}

  async execute(
    userId: string,
    lessonId: string,
  ): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }

    const subModule = await this.subModuleRepository.findById(
      lesson.subModuleId,
    );
    if (!subModule) {
      throw new NotFoundException(
        `SubModule with id "${lesson.subModuleId}" not found`,
      );
    }

    const module = await this.moduleRepository.findById(subModule.moduleId);
    if (!module) {
      throw new NotFoundException(
        `Module with id "${subModule.moduleId}" not found`,
      );
    }

    const training = await this.trainingRepository.findById(module.trainingId);
    if (!training) {
      throw new NotFoundException(
        `Training with id "${module.trainingId}" not found`,
      );
    }

    const isEnrolled = await this.enrollmentRepository.exists(
      userId,
      training.id,
    );
    if (!isEnrolled) {
      throw new ForbiddenException(
        `User is not enrolled in training with id "${training.id}"`,
      );
    }

    if (!training.published) {
      throw new ForbiddenException(
        `Training with id "${training.id}" is not published`,
      );
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
