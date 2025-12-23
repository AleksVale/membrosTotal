import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { CreateSubModuleDto } from '../dto/create-sub-module.dto';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class CreateSubModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async execute(
    moduleId: string,
    createDto: CreateSubModuleDto,
  ): Promise<SubModuleResponseDto> {
    const module = await this.moduleRepository.findById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with id "${moduleId}" not found`);
    }

    const subModule = await this.subModuleRepository.create({
      title: createDto.title,
      description: createDto.description ?? null,
      order: createDto.order,
      moduleId: createDto.moduleId,
    });

    return new SubModuleResponseDto({
      id: subModule.id,
      title: subModule.title,
      description: subModule.description,
      order: subModule.order,
      moduleId: subModule.moduleId,
      createdAt: subModule.createdAt,
      updatedAt: subModule.updatedAt,
    });
  }
}
