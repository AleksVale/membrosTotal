import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserProgress } from '../../../domain/training/entities/user-progress.entity';
import { UserProgressRepositoryInterface } from '../../../domain/training/repositories/user-progress.repository.interface';
import { ProgressResponseDto } from '../dto/progress-response.dto';

@Injectable()
export class UpdateLessonProgressUseCase {
  constructor(private readonly userProgressRepository: UserProgressRepositoryInterface) {}

  async execute(
    userId: string,
    lessonId: string,
    isCompleted: boolean,
  ): Promise<ProgressResponseDto> {
    // Try to find existing progress
    const existing = await this.userProgressRepository.findByUserAndLesson(userId, lessonId);

    let progress: UserProgress;

    if (existing) {
      // Update existing progress
      const updated = isCompleted ? existing.markAsCompleted() : existing.markAsIncomplete();
      progress = await this.userProgressRepository.update(existing.id, updated);
    } else {
      // Create new progress
      const newProgress = new UserProgress(
        randomUUID(),
        userId,
        lessonId,
        isCompleted,
        new Date(),
      );
      progress = await this.userProgressRepository.create(newProgress);
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
