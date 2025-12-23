import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class CreateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    trainingId: string,
    createDto: CreateModuleDto,
  ): Promise<ModuleResponseDto> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const orderExists = await this.moduleRepository.existsByOrderAndTrainingId(
      createDto.order,
      trainingId,
    );
    if (orderExists) {
      throw new ConflictException(
        `A module with order ${createDto.order} already exists in this training`,
      );
    }

    const module = await this.moduleRepository.create({
      title: createDto.title,
      description: createDto.description ?? null,
      order: createDto.order,
      trainingId: createDto.trainingId,
    });

    return new ModuleResponseDto({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      trainingId: module.trainingId,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt,
    });
  }
}
