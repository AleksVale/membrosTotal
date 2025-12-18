import { Injectable } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class ListTrainingsUseCase {
  constructor(private readonly trainingRepository: TrainingRepositoryInterface) {}

  async execute(): Promise<TrainingResponseDto[]> {
    const trainings = await this.trainingRepository.findAllPublished();

    return trainings.map((training) =>
      new TrainingResponseDto({
        id: training.id,
        title: training.title,
        description: training.description,
        slug: training.slug,
        imageUrl: training.imageUrl,
        published: training.published,
        order: training.order,
        createdAt: training.createdAt,
        updatedAt: training.updatedAt,
      }),
    );
  }
}
