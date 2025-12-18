import { ConflictException, Injectable } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { CreateTrainingDto } from '../dto/create-training.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class CreateTrainingUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(createDto: CreateTrainingDto): Promise<TrainingResponseDto> {
    // Check if slug already exists
    const existing = await this.trainingRepository.findBySlug(createDto.slug);
    if (existing) {
      throw new ConflictException(
        `Training with slug "${createDto.slug}" already exists`,
      );
    }

    // Create training with full hierarchy using repository
    const trainingWithHierarchy =
      await this.trainingRepository.createWithHierarchy({
        title: createDto.title,
        description: createDto.description ?? null,
        slug: createDto.slug,
        imageUrl: createDto.imageUrl ?? null,
        published: createDto.published ?? false,
        order: createDto.order ?? 0,
        modules: createDto.modules.map((m) => ({
          title: m.title,
          description: m.description ?? null,
          order: m.order,
          subModules: m.subModules.map((sm) => ({
            title: sm.title,
            description: sm.description ?? null,
            order: sm.order,
            lessons: sm.lessons.map((l) => ({
              title: l.title,
              description: l.description ?? null,
              order: l.order,
              videoUrl: l.videoUrl ?? null,
              videoProvider: l.videoProvider ?? 'external',
              duration: l.duration ?? 0,
            })),
          })),
        })),
      });

    return this.toResponseDto(trainingWithHierarchy);
  }

  private toResponseDto(
    data: import('../../../domain/training/repositories/training.repository.interface').TrainingWithHierarchy,
  ): TrainingResponseDto {
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
          videoProvider: l.videoProvider.getValue(),
          duration: l.duration,
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
      order: data.training.order,
      createdAt: data.training.createdAt,
      updatedAt: data.training.updatedAt,
      modules,
    });
  }
}
