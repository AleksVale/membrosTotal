import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    id: string,
    updateDto: UpdateModuleDto,
  ): Promise<ModuleResponseDto> {
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

    if (module.isDeleted()) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

    const training = await this.trainingRepository.findById(module.trainingId);
    if (!training) {
      throw new NotFoundException(
        `Training with id "${module.trainingId}" not found`,
      );
    }

    if (updateDto.order !== undefined && updateDto.order !== module.order) {
      const orderExists =
        await this.moduleRepository.existsByOrderAndTrainingId(
          updateDto.order,
          module.trainingId,
        );
      if (orderExists) {
        throw new ConflictException(
          `A module with order ${updateDto.order} already exists in this training`,
        );
      }
    }

    const updatedModule = module.update({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
    });

    const savedModule = await this.moduleRepository.update(id, updatedModule);

    return new ModuleResponseDto({
      id: savedModule.id,
      title: savedModule.title,
      description: savedModule.description,
      order: savedModule.order,
      trainingId: savedModule.trainingId,
      createdAt: savedModule.createdAt,
      updatedAt: savedModule.updatedAt,
    });
  }
}
