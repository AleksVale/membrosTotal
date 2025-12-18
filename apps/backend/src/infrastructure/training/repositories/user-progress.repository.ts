import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UserProgress } from '../../../domain/training/entities/user-progress.entity';
import {
  CreateUserProgressData,
  UserProgressRepositoryInterface,
} from '../../../domain/training/repositories/user-progress.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserProgressRepository implements UserProgressRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserProgressData): Promise<UserProgress> {
    const prismaProgress = await this.prisma.userProgress.create({
      data: {
        userId: data.userId,
        lessonId: data.lessonId,
        isCompleted: data.isCompleted,
        lastWatchedAt: data.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async upsert(data: CreateUserProgressData): Promise<UserProgress> {
    const prismaProgress = await this.prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: data.userId,
          lessonId: data.lessonId,
        },
      },
      update: {
        isCompleted: data.isCompleted,
        lastWatchedAt: data.lastWatchedAt,
      },
      create: {
        userId: data.userId,
        lessonId: data.lessonId,
        isCompleted: data.isCompleted,
        lastWatchedAt: data.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async findById(id: string): Promise<UserProgress | null> {
    const prismaProgress = await this.prisma.userProgress.findUnique({
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
    const prismaProgress = await this.prisma.userProgress.findUnique({
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
    const prismaProgresses = await this.prisma.userProgress.findMany({
      where: { userId },
      orderBy: { lastWatchedAt: 'desc' },
    });

    return prismaProgresses.map((p) => this.toDomainEntity(p));
  }

  async findByLessonId(lessonId: string): Promise<UserProgress[]> {
    const prismaProgresses = await this.prisma.userProgress.findMany({
      where: { lessonId },
      orderBy: { lastWatchedAt: 'desc' },
    });

    return prismaProgresses.map((p) => this.toDomainEntity(p));
  }

  async findCompletedLessonsByUser(
    userId: string,
    lessonIds: string[],
  ): Promise<UserProgress[]> {
    const prismaProgresses = await this.prisma.userProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        isCompleted: true,
      },
    });

    return prismaProgresses.map((p) => this.toDomainEntity(p));
  }

  async update(
    id: string,
    data: Partial<CreateUserProgressData>,
  ): Promise<UserProgress> {
    const prismaProgress = await this.prisma.userProgress.update({
      where: { id },
      data: {
        isCompleted: data.isCompleted,
        lastWatchedAt: data.lastWatchedAt,
      },
    });

    return this.toDomainEntity(prismaProgress);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userProgress.delete({
      where: { id },
    });
  }

  private toDomainEntity(
    prismaProgress: Prisma.UserProgressGetPayload<Record<string, never>>,
  ): UserProgress {
    return new UserProgress(
      prismaProgress.id,
      prismaProgress.userId,
      prismaProgress.lessonId,
      prismaProgress.isCompleted,
      prismaProgress.lastWatchedAt,
    );
  }
}
