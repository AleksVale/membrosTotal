import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Lesson } from '../../../domain/training/entities/lesson.entity';
import { Module } from '../../../domain/training/entities/module.entity';
import { SubModule } from '../../../domain/training/entities/sub-module.entity';
import { Training } from '../../../domain/training/entities/training.entity';
import {
  CreateTrainingData,
  TrainingRepositoryInterface,
  TrainingWithHierarchy,
} from '../../../domain/training/repositories/training.repository.interface';
import { VideoProvider } from '../../../domain/training/value-objects/video-provider.vo';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TrainingRepository implements TrainingRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(training: Training): Promise<Training> {
    const prismaTraining = await this.prisma.training.create({
      data: {
        id: training.id,
        title: training.title,
        description: training.description,
        slug: training.slug,
        imageUrl: training.imageUrl,
        published: training.published,
        order: training.order,
      },
    });

    return this.toDomainEntity(prismaTraining);
  }

  async createWithHierarchy(
    data: CreateTrainingData,
  ): Promise<TrainingWithHierarchy> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Create Training (Prisma will generate UUID)
      const prismaTraining = await tx.training.create({
        data: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          imageUrl: data.imageUrl,
          published: data.published,
          order: data.order ?? 0,
        },
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              subModules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: {
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      });

      // Create Modules, SubModules, and Lessons
      for (const moduleData of data.modules) {
        const prismaModule = await tx.module.create({
          data: {
            title: moduleData.title,
            description: moduleData.description,
            order: moduleData.order,
            trainingId: prismaTraining.id,
          },
        });

        for (const subModuleData of moduleData.subModules) {
          const prismaSubModule = await tx.subModule.create({
            data: {
              title: subModuleData.title,
              description: subModuleData.description,
              order: subModuleData.order,
              moduleId: prismaModule.id,
            },
          });

          for (const lessonData of subModuleData.lessons) {
            await tx.lesson.create({
              data: {
                title: lessonData.title,
                description: lessonData.description,
                order: lessonData.order,
                videoUrl: lessonData.videoUrl,
                videoProvider: lessonData.videoProvider,
                duration: lessonData.duration,
                isFree: true, // All lessons are free in internal tool
                subModuleId: prismaSubModule.id,
              },
            });
          }
        }
      }

      // Fetch the complete training with hierarchy
      return await tx.training.findUnique({
        where: { id: prismaTraining.id },
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              subModules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: {
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      });
    });

    if (!result) {
      throw new Error('Failed to create training');
    }

    return this.toDomainEntityWithHierarchy(result);
  }

  async findById(id: string): Promise<Training | null> {
    const prismaTraining = await this.prisma.training.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntity(prismaTraining);
  }

  async findBySlug(slug: string): Promise<Training | null> {
    const prismaTraining = await this.prisma.training.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntity(prismaTraining);
  }

  async findByIdWithHierarchy(
    id: string,
  ): Promise<TrainingWithHierarchy | null> {
    const prismaTraining = await this.prisma.training.findFirst({
      where: { id, deletedAt: null },
      include: {
        modules: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: {
            subModules: {
              where: { deletedAt: null },
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  where: { deletedAt: null },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntityWithHierarchy(prismaTraining);
  }

  async findBySlugWithHierarchy(
    slug: string,
  ): Promise<TrainingWithHierarchy | null> {
    const prismaTraining = await this.prisma.training.findFirst({
      where: { slug, deletedAt: null },
      include: {
        modules: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: {
            subModules: {
              where: { deletedAt: null },
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  where: { deletedAt: null },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntityWithHierarchy(prismaTraining);
  }

  async findAllPublished(): Promise<Training[]> {
    const prismaTrainings = await this.prisma.training.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return prismaTrainings.map((t) => this.toDomainEntity(t));
  }

  async update(id: string, training: Training): Promise<Training> {
    const prismaTraining = await this.prisma.training.update({
      where: { id },
      data: {
        title: training.title,
        description: training.description,
        slug: training.slug,
        imageUrl: training.imageUrl,
        published: training.published,
        order: training.order,
      },
    });

    return this.toDomainEntity(prismaTraining);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.training.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.training.update({
        where: { id },
        data: { deletedAt: now },
      });

      const modules = await tx.module.findMany({
        where: { trainingId: id, deletedAt: null },
      });

      for (const module of modules) {
        await tx.module.update({
          where: { id: module.id },
          data: { deletedAt: now },
        });

        const subModules = await tx.subModule.findMany({
          where: { moduleId: module.id, deletedAt: null },
        });

        for (const subModule of subModules) {
          await tx.subModule.update({
            where: { id: subModule.id },
            data: { deletedAt: now },
          });

          await tx.lesson.updateMany({
            where: { subModuleId: subModule.id, deletedAt: null },
            data: { deletedAt: now },
          });
        }
      }
    });
  }

  async reorder(id: string, newOrder: number): Promise<Training> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.training.findFirst({
        where: { id, deletedAt: null },
      });

      if (!item) {
        throw new Error(`Training with id "${id}" not found`);
      }

      const allItems = await tx.training.findMany({
        where: { deletedAt: null },
        orderBy: { order: 'asc' },
      });

      const currentIndex = allItems.findIndex((t) => t.id === id);
      if (currentIndex === -1) {
        throw new Error(`Training with id "${id}" not found`);
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
        await tx.training.update({
          where: { id: reorderedItems[i].id },
          data: { order: i + 1 },
        });
      }

      const updated = await tx.training.findUnique({
        where: { id },
      });

      if (!updated) {
        throw new Error(`Training with id "${id}" not found`);
      }

      return this.toDomainEntity(updated);
    });
  }

  async swapOrders(id1: string, id2: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item1 = await tx.training.findFirst({
        where: { id: id1, deletedAt: null },
      });
      const item2 = await tx.training.findFirst({
        where: { id: id2, deletedAt: null },
      });

      if (!item1) {
        throw new Error(`Training with id "${id1}" not found`);
      }
      if (!item2) {
        throw new Error(`Training with id "${id2}" not found`);
      }

      const tempOrder = item1.order;
      await tx.training.update({
        where: { id: id1 },
        data: { order: item2.order },
      });
      await tx.training.update({
        where: { id: id2 },
        data: { order: tempOrder },
      });
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.training.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  private toDomainEntity(
    prismaTraining: Prisma.TrainingGetPayload<Record<string, never>>,
  ): Training {
    return new Training(
      prismaTraining.id,
      prismaTraining.title,
      prismaTraining.description,
      prismaTraining.slug,
      prismaTraining.imageUrl,
      prismaTraining.published,
      prismaTraining.order,
      prismaTraining.deletedAt,
      prismaTraining.createdAt,
      prismaTraining.updatedAt,
    );
  }

  private toDomainEntityWithHierarchy(
    prismaTraining: Prisma.TrainingGetPayload<{
      include: {
        modules: {
          include: {
            subModules: {
              include: {
                lessons: true;
              };
            };
          };
        };
      };
    }>,
  ): TrainingWithHierarchy {
    const training = this.toDomainEntity(prismaTraining);

    const modules = prismaTraining.modules.map((m) => ({
      module: new Module(
        m.id,
        m.title,
        m.description,
        m.order,
        m.trainingId,
        m.deletedAt,
        m.createdAt,
        m.updatedAt,
      ),
      subModules: m.subModules.map((sm) => ({
        subModule: new SubModule(
          sm.id,
          sm.title,
          sm.description,
          sm.order,
          sm.moduleId,
          sm.deletedAt,
          sm.createdAt,
          sm.updatedAt,
        ),
        lessons: sm.lessons.map((l) => this.toLessonEntity(l)),
      })),
    }));

    return { training, modules };
  }

  private toLessonEntity(prismaLesson: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    videoUrl: string | null;
    videoProvider: string;
    duration: number;
    subModuleId: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Lesson {
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
