import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class GetModuleUseCase {
  constructor(private readonly moduleRepository: ModuleRepositoryInterface) {}

  async execute(id: string): Promise<ModuleResponseDto> {
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

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
