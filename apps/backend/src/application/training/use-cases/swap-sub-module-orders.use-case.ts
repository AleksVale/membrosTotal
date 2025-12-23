import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class SwapSubModuleOrdersUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(
    id1: string,
    id2: string,
  ): Promise<[SubModuleResponseDto, SubModuleResponseDto]> {
    const subModule1 = await this.subModuleRepository.findById(id1);
    if (!subModule1) {
      throw new NotFoundException(`SubModule with id "${id1}" not found`);
    }

    const subModule2 = await this.subModuleRepository.findById(id2);
    if (!subModule2) {
      throw new NotFoundException(`SubModule with id "${id2}" not found`);
    }

    if (subModule1.moduleId !== subModule2.moduleId) {
      throw new ConflictException(
        `SubModules must belong to the same module. SubModule ${id1} belongs to module ${subModule1.moduleId}, subModule ${id2} belongs to module ${subModule2.moduleId}`,
      );
    }

    try {
      await this.subModuleRepository.swapOrders(id1, id2);

      const updated1 = await this.subModuleRepository.findById(id1);
      const updated2 = await this.subModuleRepository.findById(id2);

      if (!updated1 || !updated2) {
        throw new NotFoundException('Failed to retrieve updated submodules');
      }

      return [
        new SubModuleResponseDto({
          id: updated1.id,
          title: updated1.title,
          description: updated1.description,
          order: updated1.order,
          moduleId: updated1.moduleId,
          createdAt: updated1.createdAt,
          updatedAt: updated1.updatedAt,
        }),
        new SubModuleResponseDto({
          id: updated2.id,
          title: updated2.title,
          description: updated2.description,
          order: updated2.order,
          moduleId: updated2.moduleId,
          createdAt: updated2.createdAt,
          updatedAt: updated2.updatedAt,
        }),
      ];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('must belong to the same module')) {
          throw new ConflictException(error.message);
        }
      }
      throw error;
    }
  }
}
