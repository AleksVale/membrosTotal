import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class SwapTrainingOrdersUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    id1: string,
    id2: string,
  ): Promise<[TrainingResponseDto, TrainingResponseDto]> {
    const training1 = await this.trainingRepository.findById(id1);
    if (!training1) {
      throw new NotFoundException(`Training with id "${id1}" not found`);
    }

    const training2 = await this.trainingRepository.findById(id2);
    if (!training2) {
      throw new NotFoundException(`Training with id "${id2}" not found`);
    }

    try {
      await this.trainingRepository.swapOrders(id1, id2);

      const updated1 = await this.trainingRepository.findById(id1);
      const updated2 = await this.trainingRepository.findById(id2);

      if (!updated1 || !updated2) {
        throw new NotFoundException('Failed to retrieve updated trainings');
      }

      return [
        new TrainingResponseDto({
          id: updated1.id,
          title: updated1.title,
          description: updated1.description,
          slug: updated1.slug,
          imageUrl: updated1.imageUrl,
          published: updated1.published,
          order: updated1.order,
          createdAt: updated1.createdAt,
          updatedAt: updated1.updatedAt,
        }),
        new TrainingResponseDto({
          id: updated2.id,
          title: updated2.title,
          description: updated2.description,
          slug: updated2.slug,
          imageUrl: updated2.imageUrl,
          published: updated2.published,
          order: updated2.order,
          createdAt: updated2.createdAt,
          updatedAt: updated2.updatedAt,
        }),
      ];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
      }
      throw error;
    }
  }
}
