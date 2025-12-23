import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';

@Injectable()
export class SoftDeleteTrainingUseCase {
  constructor(
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    if (training.isDeleted()) {
      throw new NotFoundException(`Training with id "${id}" not found`);
    }

    await this.trainingRepository.softDelete(id);
  }
}
