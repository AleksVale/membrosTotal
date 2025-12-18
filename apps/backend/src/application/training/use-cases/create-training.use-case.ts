import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';
import { Training } from '../../../domain/training/entities/training.entity';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTrainingDto } from '../dto/create-training.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class CreateTrainingUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(createDto: CreateTrainingDto): Promise<TrainingResponseDto> {
    // Check if slug already exists
    const existing = await this.trainingRepository.findBySlug(createDto.slug);
    if (existing) {
      throw new ConflictException(
        `Training with slug "${createDto.slug}" already exists`,
      );
    }

    const result = await this.prisma.$transaction(
      async (tx: TransactionClient) => {
        const training = new Training(
          randomUUID(),
          createDto.title,
          createDto.description ?? null,
          createDto.slug,
          createDto.imageUrl ?? null,
          createDto.published ?? false,
          createDto.price ?? 0,
          new Date(),
          new Date(),
        );

        const prismaTraining = await tx.training.create({
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

        // Create Modules, SubModules, and Lessons
        for (const moduleDto of createDto.modules) {
          const moduleId = randomUUID();
          await tx.module.create({
            data: {
              id: moduleId,
              title: moduleDto.title,
              description: moduleDto.description ?? null,
              order: moduleDto.order,
              trainingId: training.id,
            },
          });

          for (const subModuleDto of moduleDto.subModules) {
            const subModuleId = randomUUID();
            await tx.subModule.create({
              data: {
                id: subModuleId,
                title: subModuleDto.title,
                description: subModuleDto.description ?? null,
                order: subModuleDto.order,
                moduleId: moduleId,
              },
            });

            for (const lessonDto of subModuleDto.lessons) {
              await tx.lesson.create({
                data: {
                  id: randomUUID(),
                  title: lessonDto.title,
                  description: lessonDto.description ?? null,
                  order: lessonDto.order,
                  videoUrl: lessonDto.videoUrl ?? null,
                  videoProvider: lessonDto.videoProvider ?? 'external',
                  duration: lessonDto.duration ?? 0,
                  isFree: lessonDto.isFree ?? false,
                  subModuleId: subModuleId,
                },
              });
            }
          }
        }

        return prismaTraining;
      },
    );

    // Fetch the complete training with hierarchy
    const trainingWithHierarchy =
      await this.trainingRepository.findByIdWithHierarchy(result.id);
    if (!trainingWithHierarchy) {
      throw new Error('Failed to retrieve created training');
    }

    return this.toResponseDto(trainingWithHierarchy);
  }

  private toResponseDto(data: {
    training: Training;
    modules: Array<{
      module: any;
      subModules: Array<{
        subModule: any;
        lessons: any[];
      }>;
    }>;
  }): TrainingResponseDto {
    const modules = data.modules.map((m) => ({
      id: m.module.id,
      title: m.module.title,
      description: m.module.description,
      order: m.module.order,
      trainingId: m.module.trainingId,
      subModules: m.subModules.map((sm) => ({
        id: sm.subModule.id,
        title: sm.subModule.title,
        description: sm.subModule.description,
        order: sm.subModule.order,
        moduleId: sm.subModule.moduleId,
        lessons: sm.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          order: l.order,
          videoUrl: l.videoUrl,
          videoProvider: l.videoProvider,
          duration: l.duration,
          isFree: l.isFree,
          subModuleId: l.subModuleId,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        })),
        createdAt: sm.subModule.createdAt,
        updatedAt: sm.subModule.updatedAt,
      })),
      createdAt: m.module.createdAt,
      updatedAt: m.module.updatedAt,
    }));

    return new TrainingResponseDto({
      id: data.training.id,
      title: data.training.title,
      description: data.training.description,
      slug: data.training.slug,
      imageUrl: data.training.imageUrl,
      published: data.training.published,
      price: data.training.price,
      createdAt: data.training.createdAt,
      updatedAt: data.training.updatedAt,
      modules: modules as any,
    });
  }
}
