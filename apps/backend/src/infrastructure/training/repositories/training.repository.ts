import { Injectable } from '@nestjs/common';
import { Lesson } from '../../../domain/training/entities/lesson.entity';
import { Module } from '../../../domain/training/entities/module.entity';
import { SubModule } from '../../../domain/training/entities/sub-module.entity';
import { Training } from '../../../domain/training/entities/training.entity';
import {
    TrainingRepositoryInterface,
    TrainingWithHierarchy,
} from '../../../domain/training/repositories/training.repository.interface';
import { VideoProvider } from '../../../domain/training/value-objects/video-provider.vo';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TrainingRepository implements TrainingRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(training: Training): Promise<Training> {
    const prismaTraining = await (this.prisma as any).training.create({
      data: {
        id: training.id,
        title: training.title,
        description: training.description,
        slug: training.slug,
        imageUrl: training.imageUrl,
        published: training.published,
        price: training.price,
      },
    });

    return this.toDomainEntity(prismaTraining);
  }

  async findById(id: string): Promise<Training | null> {
    const prismaTraining = await (this.prisma as any).training.findUnique({
      where: { id },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntity(prismaTraining);
  }

  async findBySlug(slug: string): Promise<Training | null> {
    const prismaTraining = await (this.prisma as any).training.findUnique({
      where: { slug },
    });

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntity(prismaTraining);
  }

  async findByIdWithHierarchy(id: string): Promise<TrainingWithHierarchy | null> {
    const prismaTraining = await (this.prisma as any).training.findUnique({
      where: { id },
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

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntityWithHierarchy(prismaTraining);
  }

  async findBySlugWithHierarchy(slug: string): Promise<TrainingWithHierarchy | null> {
    const prismaTraining = await (this.prisma as any).training.findUnique({
      where: { slug },
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

    if (!prismaTraining) {
      return null;
    }

    return this.toDomainEntityWithHierarchy(prismaTraining);
  }

  async findAllPublished(): Promise<Training[]> {
    const prismaTrainings = await (this.prisma as any).training.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return prismaTrainings.map((t: any) => this.toDomainEntity(t));
  }

  async update(id: string, training: Training): Promise<Training> {
    const prismaTraining = await (this.prisma as any).training.update({
      where: { id },
      data: {
        title: training.title,
        description: training.description,
        slug: training.slug,
        imageUrl: training.imageUrl,
        published: training.published,
        price: training.price,
      },
    });

    return this.toDomainEntity(prismaTraining);
  }

  async delete(id: string): Promise<void> {
    await (this.prisma as any).training.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await (this.prisma as any).training.count({
      where: { id },
    });
    return count > 0;
  }

  private toDomainEntity(prismaTraining: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    imageUrl: string | null;
    published: boolean;
    price: any; // Decimal from Prisma
    createdAt: Date;
    updatedAt: Date;
  }): Training {
    return new Training(
      prismaTraining.id,
      prismaTraining.title,
      prismaTraining.description,
      prismaTraining.slug,
      prismaTraining.imageUrl,
      prismaTraining.published,
      Number(prismaTraining.price),
      prismaTraining.createdAt,
      prismaTraining.updatedAt,
    );
  }

  private toDomainEntityWithHierarchy(prismaTraining: any): TrainingWithHierarchy {
    const training = this.toDomainEntity(prismaTraining);

    const modules = prismaTraining.modules.map((m: any) => ({
      module: new Module(
        m.id,
        m.title,
        m.description,
        m.order,
        m.trainingId,
        m.createdAt,
        m.updatedAt,
      ),
      subModules: m.subModules.map((sm: any) => ({
        subModule: new SubModule(
          sm.id,
          sm.title,
          sm.description,
          sm.order,
          sm.moduleId,
          sm.createdAt,
          sm.updatedAt,
        ),
        lessons: sm.lessons.map((l: any) =>
          this.toLessonEntity(l),
        ),
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
    isFree: boolean;
    subModuleId: string;
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
      prismaLesson.isFree,
      prismaLesson.subModuleId,
      prismaLesson.createdAt,
      prismaLesson.updatedAt,
    );
  }
}
