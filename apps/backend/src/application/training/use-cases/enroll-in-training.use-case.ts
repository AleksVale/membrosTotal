import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class EnrollInTrainingUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    userId: string,
    trainingId: string,
  ): Promise<EnrollmentResponseDto> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const existing = await this.enrollmentRepository.findByUserAndTraining(
      userId,
      trainingId,
    );
    if (existing) {
      return new EnrollmentResponseDto({
        id: existing.id,
        userId: existing.userId,
        trainingId: existing.trainingId,
        enrolledAt: existing.enrolledAt,
      });
    }

    const created = await this.enrollmentRepository.create({
      userId,
      trainingId,
      enrolledAt: new Date(),
    });

    return new EnrollmentResponseDto({
      id: created.id,
      userId: created.userId,
      trainingId: created.trainingId,
      enrolledAt: created.enrolledAt,
    });
  }
}
