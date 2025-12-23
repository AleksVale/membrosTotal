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

  async reorder(id: string, newOrder: number): Promise<Lesson> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.lesson.findFirst({
        where: { id, deletedAt: null },
      });

      if (!item) {
        throw new Error(`Lesson with id "${id}" not found`);
      }

      const allItems = await tx.lesson.findMany({
        where: { subModuleId: item.subModuleId, deletedAt: null },
        orderBy: { order: 'asc' },
      });

      const currentIndex = allItems.findIndex((l) => l.id === id);
      if (currentIndex === -1) {
        throw new Error(`Lesson with id "${id}" not found`);
      }

      if (newOrder < 1 || newOrder > allItems.length) {
        throw new Error(
          `Invalid order position: ${newOrder}. Must be between 1 and ${allItems.length}`,
        );
      }

      const targetIndex = newOrder - 1;

      if (currentIndex === targetIndex) {
        return this.toDomainEntity(item);
      }

      const reorderedItems = [...allItems];
      const [movedItem] = reorderedItems.splice(currentIndex, 1);
      reorderedItems.splice(targetIndex, 0, movedItem);

      for (let i = 0; i < reorderedItems.length; i++) {
        await tx.lesson.update({
          where: { id: reorderedItems[i].id },
          data: { order: i + 1 },
        });
      }

      const updated = await tx.lesson.findUnique({
        where: { id },
      });

      if (!updated) {
        throw new Error(`Lesson with id "${id}" not found`);
      }

      return this.toDomainEntity(updated);
    });
  }

  async swapOrders(id1: string, id2: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item1 = await tx.lesson.findFirst({
        where: { id: id1, deletedAt: null },
      });
      const item2 = await tx.lesson.findFirst({
        where: { id: id2, deletedAt: null },
      });

      if (!item1) {
        throw new Error(`Lesson with id "${id1}" not found`);
      }
      if (!item2) {
        throw new Error(`Lesson with id "${id2}" not found`);
      }

      if (item1.subModuleId !== item2.subModuleId) {
        throw new Error(
          `Lessons must belong to the same submodule. Lesson ${id1} belongs to subModule ${item1.subModuleId}, lesson ${id2} belongs to subModule ${item2.subModuleId}`,
        );
      }

      const tempOrder = item1.order;
      await tx.lesson.update({
        where: { id: id1 },
        data: { order: item2.order },
      });
      await tx.lesson.update({
        where: { id: id2 },
        data: { order: tempOrder },
      });
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
