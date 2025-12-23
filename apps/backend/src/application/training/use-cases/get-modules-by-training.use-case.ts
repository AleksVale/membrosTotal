import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class GetModulesByTrainingUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(trainingId: string): Promise<ModuleResponseDto[]> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const modules = await this.moduleRepository.findByTrainingId(trainingId);

    return modules.map(
      (module) =>
        new ModuleResponseDto({
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          trainingId: module.trainingId,
          createdAt: module.createdAt,
          updatedAt: module.updatedAt,
        }),
    );
  }
}
