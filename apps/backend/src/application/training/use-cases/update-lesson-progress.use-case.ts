import { Injectable } from '@nestjs/common';
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

    let progress;

    if (existing) {
      // Update existing progress
      progress = await this.userProgressRepository.update(existing.id, {
        isCompleted,
        lastWatchedAt: new Date(),
      });
    } else {
      // Create new progress (Prisma will generate UUID)
      progress = await this.userProgressRepository.create({
        userId,
        lessonId,
        isCompleted,
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
