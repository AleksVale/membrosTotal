import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class GetTrainingUseCase {
  constructor(private readonly trainingRepository: TrainingRepositoryInterface) {}

  async execute(id: string, includeHierarchy: boolean = false): Promise<TrainingResponseDto> {
    let trainingWithHierarchy;

    if (includeHierarchy) {
      trainingWithHierarchy = await this.trainingRepository.findByIdWithHierarchy(id);
    } else {
      const training = await this.trainingRepository.findById(id);
      if (!training) {
        throw new NotFoundException(`Training with id "${id}" not found`);
      }
      trainingWithHierarchy = { training, modules: [] };
    }

    if (!trainingWithHierarchy) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    return this.toResponseDto(trainingWithHierarchy);
  }

  private toResponseDto(data: {
    training: any;
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
      modules: modules as any,
    });
  }
}
