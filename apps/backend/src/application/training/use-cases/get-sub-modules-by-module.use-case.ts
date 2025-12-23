import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class GetSubModulesByModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async execute(moduleId: string): Promise<SubModuleResponseDto[]> {
    const module = await this.moduleRepository.findById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with id "${moduleId}" not found`);
    }

    const subModules = await this.subModuleRepository.findByModuleId(moduleId);

    return subModules.map(
      (subModule) =>
        new SubModuleResponseDto({
          id: subModule.id,
          title: subModule.title,
          description: subModule.description,
          order: subModule.order,
          moduleId: subModule.moduleId,
          createdAt: subModule.createdAt,
          updatedAt: subModule.updatedAt,
        }),
    );
  }
}
