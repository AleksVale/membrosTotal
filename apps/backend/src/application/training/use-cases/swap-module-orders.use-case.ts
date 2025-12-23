import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class SwapModuleOrdersUseCase {
  constructor(private readonly moduleRepository: ModuleRepositoryInterface) {}

  async execute(
    id1: string,
    id2: string,
  ): Promise<[ModuleResponseDto, ModuleResponseDto]> {
    const module1 = await this.moduleRepository.findById(id1);
    if (!module1) {
      throw new NotFoundException(`Module with id "${id1}" not found`);
    }

    const module2 = await this.moduleRepository.findById(id2);
    if (!module2) {
      throw new NotFoundException(`Module with id "${id2}" not found`);
    }

    if (module1.trainingId !== module2.trainingId) {
      throw new ConflictException(
        `Modules must belong to the same training. Module ${id1} belongs to training ${module1.trainingId}, module ${id2} belongs to training ${module2.trainingId}`,
      );
    }

    try {
      await this.moduleRepository.swapOrders(id1, id2);

      const updated1 = await this.moduleRepository.findById(id1);
      const updated2 = await this.moduleRepository.findById(id2);

      if (!updated1 || !updated2) {
        throw new NotFoundException('Failed to retrieve updated modules');
      }

      return [
        new ModuleResponseDto({
          id: updated1.id,
          title: updated1.title,
          description: updated1.description,
          order: updated1.order,
          trainingId: updated1.trainingId,
          createdAt: updated1.createdAt,
          updatedAt: updated1.updatedAt,
        }),
        new ModuleResponseDto({
          id: updated2.id,
          title: updated2.title,
          description: updated2.description,
          order: updated2.order,
          trainingId: updated2.trainingId,
          createdAt: updated2.createdAt,
          updatedAt: updated2.updatedAt,
        }),
      ];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('must belong to the same training')) {
          throw new ConflictException(error.message);
        }
      }
      throw error;
    }
  }
}
