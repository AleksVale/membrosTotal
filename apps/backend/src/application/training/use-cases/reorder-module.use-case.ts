import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class ReorderModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(id: string, newOrder: number): Promise<ModuleResponseDto> {
    if (newOrder < 1) {
      throw new BadRequestException('Order must be at least 1');
    }

    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

    const training = await this.trainingRepository.findById(module.trainingId);
    if (!training) {
      throw new NotFoundException(
        `Training with id "${module.trainingId}" not found`,
      );
    }

    const modules = await this.moduleRepository.findByTrainingId(
      module.trainingId,
    );
    if (newOrder > modules.length) {
      throw new BadRequestException(
        `Invalid order position: ${newOrder}. Must be between 1 and ${modules.length}`,
      );
    }

    try {
      const updatedModule = await this.moduleRepository.reorder(id, newOrder);

      return new ModuleResponseDto({
        id: updatedModule.id,
        title: updatedModule.title,
        description: updatedModule.description,
        order: updatedModule.order,
        trainingId: updatedModule.trainingId,
        createdAt: updatedModule.createdAt,
        updatedAt: updatedModule.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('Invalid order position')) {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }
}
