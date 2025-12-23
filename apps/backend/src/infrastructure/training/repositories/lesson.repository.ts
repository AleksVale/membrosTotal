import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Lesson } from '../../../domain/training/entities/lesson.entity';
import {
    CreateLessonData,
    LessonRepositoryInterface,
} from '../../../domain/training/repositories/lesson.repository.interface';
import { VideoProvider } from '../../../domain/training/value-objects/video-provider.vo';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LessonRepository implements LessonRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLessonData): Promise<Lesson> {
    const prismaLesson = await this.prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        videoUrl: data.videoUrl,
        videoProvider: data.videoProvider,
        duration: data.duration,
        subModuleId: data.subModuleId,
        isFree: true,
      },
    });

    return this.toDomainEntity(prismaLesson);
  }

  async findById(id: string): Promise<Lesson | null> {
    const prismaLesson = await this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prismaLesson) {
      return null;
    }

    return this.toDomainEntity(prismaLesson);
  }

  async findBySubModuleId(subModuleId: string): Promise<Lesson[]> {
    const prismaLessons = await this.prisma.lesson.findMany({
      where: { subModuleId, deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return prismaLessons.map((lesson) => this.toDomainEntity(lesson));
  }

  async update(id: string, lesson: Lesson): Promise<Lesson> {
    const prismaLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        videoUrl: lesson.videoUrl,
        videoProvider: lesson.videoProvider.getValue(),
        duration: lesson.duration,
      },
    });

    return this.toDomainEntity(prismaLesson);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.lesson.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async existsByOrderAndSubModuleId(
    order: number,
    subModuleId: string,
  ): Promise<boolean> {
    const count = await this.prisma.lesson.count({
      where: {
        order,
        subModuleId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  private toDomainEntity(
    prismaLesson: Prisma.LessonGetPayload<Record<string, never>>,
  ): Lesson {
    return new Lesson(
      prismaLesson.id,
      prismaLesson.title,
      prismaLesson.description,
      prismaLesson.order,
      prismaLesson.videoUrl,
      new VideoProvider(prismaLesson.videoProvider),
      prismaLesson.duration,
      prismaLesson.subModuleId,
      prismaLesson.deletedAt,
      prismaLesson.createdAt,
      prismaLesson.updatedAt,
    );
  }
}
