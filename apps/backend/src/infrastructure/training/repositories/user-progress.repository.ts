import { Injectable } from '@nestjs/common';
import { UserProgress } from '../../../domain/training/entities/user-progress.entity';
import { UserProgressRepositoryInterface } from '../../../domain/training/repositories/user-progress.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserProgressRepository implements UserProgressRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(progress: UserProgress): Promise<UserProgress> {
    const prismaProgress = await (this.prisma as any).userProgress.create({
      data: {
        id: progress.id,
        userId: progress.userId,
        lessonId: progress.lessonId,
        isCompleted: progress.isCompleted,
        lastWatchedAt: progress.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async upsert(progress: UserProgress): Promise<UserProgress> {
    const prismaProgress = await (this.prisma as any).userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: progress.userId,
          lessonId: progress.lessonId,
        },
      },
      update: {
        isCompleted: progress.isCompleted,
        lastWatchedAt: progress.lastWatchedAt,
      },
      create: {
        id: progress.id,
        userId: progress.userId,
        lessonId: progress.lessonId,
        isCompleted: progress.isCompleted,
        lastWatchedAt: progress.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async findById(id: string): Promise<UserProgress | null> {
    const prismaProgress = await (this.prisma as any).userProgress.findUnique({
      where: { id },
    });

    if (!prismaProgress) {
      return null;
    }

    return this.toDomainEntity(prismaProgress);
  }

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserProgress | null> {
    const prismaProgress = await (this.prisma as any).userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!prismaProgress) {
      return null;
    }

    return this.toDomainEntity(prismaProgress);
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    const prismaProgresses = await (this.prisma as any).userProgress.findMany({
      where: { userId },
      orderBy: { lastWatchedAt: 'desc' },
    });

    return prismaProgresses.map((p: any) => this.toDomainEntity(p));
  }

  async findByLessonId(lessonId: string): Promise<UserProgress[]> {
    const prismaProgresses = await (this.prisma as any).userProgress.findMany({
      where: { lessonId },
      orderBy: { lastWatchedAt: 'desc' },
    });

    return prismaProgresses.map((p: any) => this.toDomainEntity(p));
  }

  async findCompletedLessonsByUser(
    userId: string,
    lessonIds: string[],
  ): Promise<UserProgress[]> {
    const prismaProgresses = await (this.prisma as any).userProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        isCompleted: true,
      },
    });

    return prismaProgresses.map((p: any) => this.toDomainEntity(p));
  }

  async update(id: string, progress: UserProgress): Promise<UserProgress> {
    const prismaProgress = await (this.prisma as any).userProgress.update({
      where: { id },
      data: {
        isCompleted: progress.isCompleted,
        lastWatchedAt: progress.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async delete(id: string): Promise<void> {
    await (this.prisma as any).userProgress.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaProgress: {
    id: string;
    userId: string;
    lessonId: string;
    isCompleted: boolean;
    lastWatchedAt: Date;
  }): UserProgress {
    return new UserProgress(
      prismaProgress.id,
      prismaProgress.userId,
      prismaProgress.lessonId,
      prismaProgress.isCompleted,
      prismaProgress.lastWatchedAt,
    );
  }
}
