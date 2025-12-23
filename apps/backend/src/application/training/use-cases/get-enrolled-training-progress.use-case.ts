import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { UserProgressRepositoryInterface } from '../../../domain/training/repositories/user-progress.repository.interface';
import {
  ProgressResponseDto,
  TrainingProgressResponseDto,
} from '../dto/progress-response.dto';

@Injectable()
export class GetEnrolledTrainingProgressUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly userProgressRepository: UserProgressRepositoryInterface,
  ) {}

  async execute(
    userId: string,
    trainingId: string,
  ): Promise<TrainingProgressResponseDto> {
    const isEnrolled = await this.enrollmentRepository.exists(
      userId,
      trainingId,
    );
    if (!isEnrolled) {
      throw new ForbiddenException(
        `User is not enrolled in training with id "${trainingId}"`,
      );
    }

    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    if (!training.published) {
      throw new ForbiddenException(
        `Training with id "${trainingId}" is not published`,
      );
    }

    const trainingWithHierarchy =
      await this.trainingRepository.findByIdWithHierarchy(trainingId);
    if (!trainingWithHierarchy) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const lessonIds: string[] = [];
    for (const module of trainingWithHierarchy.modules) {
      for (const subModule of module.subModules) {
        for (const lesson of subModule.lessons) {
          lessonIds.push(lesson.id);
        }
      }
    }

    const totalLessons = lessonIds.length;

    const completedProgress =
      await this.userProgressRepository.findCompletedLessonsByUser(
        userId,
        lessonIds,
      );

    const completedLessons = completedProgress.length;
    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const allProgress = await this.userProgressRepository.findByUserId(userId);
    const trainingProgress = allProgress.filter((p) =>
      lessonIds.includes(p.lessonId),
    );

    return new TrainingProgressResponseDto({
      trainingId,
      totalLessons,
      completedLessons,
      completionPercentage,
      progress: trainingProgress.map(
        (p) =>
          new ProgressResponseDto({
            id: p.id,
            userId: p.userId,
            lessonId: p.lessonId,
            isCompleted: p.isCompleted,
            lastWatchedAt: p.lastWatchedAt,
          }),
      ),
    });
  }
}
