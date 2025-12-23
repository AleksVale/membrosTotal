import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';

@Injectable()
export class UnenrollUserUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(userId: string, trainingId: string): Promise<void> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const enrollment = await this.enrollmentRepository.findByUserAndTraining(
      userId,
      trainingId,
    );
    if (!enrollment) {
      throw new NotFoundException(
        `User "${userId}" is not enrolled in training "${trainingId}"`,
      );
    }

    await this.enrollmentRepository.deleteByUserAndTraining(userId, trainingId);
  }
}
