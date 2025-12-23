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
import { UserProgressRepositoryInterface } from '../../../domain/training/repositories/user-progress.repository.interface';
import { ProgressResponseDto } from '../dto/progress-response.dto';

@Injectable()
export class WatchEnrolledLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly userProgressRepository: UserProgressRepositoryInterface,
  ) {}

  async execute(userId: string, lessonId: string): Promise<ProgressResponseDto> {
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

    const existing = await this.userProgressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );

    let progress;

    if (existing) {
      progress = await this.userProgressRepository.update(existing.id, {
        isCompleted: existing.isCompleted,
        lastWatchedAt: new Date(),
      });
    } else {
      progress = await this.userProgressRepository.create({
        userId,
        lessonId,
        isCompleted: false,
        lastWatchedAt: new Date(),
      });
    }

    return new ProgressResponseDto({
      id: progress.id,
      userId: progress.userId,
      lessonId: progress.lessonId,
      isCompleted: progress.isCompleted,
      lastWatchedAt: progress.lastWatchedAt,
    });
  }
}
