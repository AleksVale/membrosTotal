import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class ReorderSubModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async execute(id: string, newOrder: number): Promise<SubModuleResponseDto> {
    if (newOrder < 1) {
      throw new BadRequestException('Order must be at least 1');
    }

    const subModule = await this.subModuleRepository.findById(id);
    if (!subModule) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

    const module = await this.moduleRepository.findById(subModule.moduleId);
    if (!module) {
      throw new NotFoundException(
        `Module with id "${subModule.moduleId}" not found`,
      );
    }

    const subModules = await this.subModuleRepository.findByModuleId(
      subModule.moduleId,
    );
    if (newOrder > subModules.length) {
      throw new BadRequestException(
        `Invalid order position: ${newOrder}. Must be between 1 and ${subModules.length}`,
      );
    }

    try {
      const updatedSubModule = await this.subModuleRepository.reorder(
        id,
        newOrder,
      );

      return new SubModuleResponseDto({
        id: updatedSubModule.id,
        title: updatedSubModule.title,
        description: updatedSubModule.description,
        order: updatedSubModule.order,
        moduleId: updatedSubModule.moduleId,
        createdAt: updatedSubModule.createdAt,
        updatedAt: updatedSubModule.updatedAt,
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
