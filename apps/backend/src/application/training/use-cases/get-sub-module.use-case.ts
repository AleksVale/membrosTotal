import { Injectable, NotFoundException } from '@nestjs/common';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class GetSubModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(id: string): Promise<SubModuleResponseDto> {
    const subModule = await this.subModuleRepository.findById(id);
    if (!subModule) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

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
