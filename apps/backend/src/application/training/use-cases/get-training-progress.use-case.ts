import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { UserProgressRepositoryInterface } from '../../../domain/training/repositories/user-progress.repository.interface';
import { ProgressResponseDto, TrainingProgressResponseDto } from '../dto/progress-response.dto';

@Injectable()
export class GetTrainingProgressUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly userProgressRepository: UserProgressRepositoryInterface,
  ) {}

  async execute(userId: string, trainingId: string): Promise<TrainingProgressResponseDto> {
    // Get training with hierarchy to count all lessons
    const trainingWithHierarchy = await this.trainingRepository.findByIdWithHierarchy(trainingId);
    if (!trainingWithHierarchy) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    // Collect all lesson IDs
    const lessonIds: string[] = [];
    for (const module of trainingWithHierarchy.modules) {
      for (const subModule of module.subModules) {
        for (const lesson of subModule.lessons) {
          lessonIds.push(lesson.id);
        }
      }
    }

    const totalLessons = lessonIds.length;

    // Get completed lessons for this user
    const completedProgress = await this.userProgressRepository.findCompletedLessonsByUser(
      userId,
      lessonIds,
    );

    const completedLessons = completedProgress.length;
    const completionPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Get all progress for this training's lessons
    const allProgress = await this.userProgressRepository.findByUserId(userId);
    const trainingProgress = allProgress.filter((p) => lessonIds.includes(p.lessonId));

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
