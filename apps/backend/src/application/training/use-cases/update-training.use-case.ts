import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';
import { UpdateTrainingDto } from '../dto/update-training.dto';

@Injectable()
export class UpdateTrainingUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    id: string,
    updateDto: UpdateTrainingDto,
  ): Promise<TrainingResponseDto> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    if (training.isDeleted()) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    if (updateDto.slug && updateDto.slug !== training.slug) {
      const existing = await this.trainingRepository.findBySlug(updateDto.slug);
      if (existing) {
        throw new ConflictException(
          `Training with slug "${updateDto.slug}" already exists`,
        );
      }
    }

    const updatedTraining = training.update({
      title: updateDto.title,
      description: updateDto.description,
      slug: updateDto.slug,
      imageUrl: updateDto.imageUrl,
      published: updateDto.published,
      order: updateDto.order,
    });

    const savedTraining = await this.trainingRepository.update(
      id,
      updatedTraining,
    );

    return new TrainingResponseDto({
      id: savedTraining.id,
      title: savedTraining.title,
      description: savedTraining.description,
      slug: savedTraining.slug,
      imageUrl: savedTraining.imageUrl,
      published: savedTraining.published,
      order: savedTraining.order,
      createdAt: savedTraining.createdAt,
      updatedAt: savedTraining.updatedAt,
    });
  }
}
