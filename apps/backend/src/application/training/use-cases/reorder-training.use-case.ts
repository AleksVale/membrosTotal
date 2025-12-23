import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class ReorderTrainingUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(id: string, newOrder: number): Promise<TrainingResponseDto> {
    if (newOrder < 1) {
      throw new BadRequestException('Order must be at least 1');
    }

    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    try {
      const updatedTraining = await this.trainingRepository.reorder(
        id,
        newOrder,
      );

      return new TrainingResponseDto({
        id: updatedTraining.id,
        title: updatedTraining.title,
        description: updatedTraining.description,
        slug: updatedTraining.slug,
        imageUrl: updatedTraining.imageUrl,
        published: updatedTraining.published,
        order: updatedTraining.order,
        createdAt: updatedTraining.createdAt,
        updatedAt: updatedTraining.updatedAt,
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
