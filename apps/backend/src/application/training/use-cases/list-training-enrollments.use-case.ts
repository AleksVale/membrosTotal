import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class ListTrainingEnrollmentsUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(trainingId: string): Promise<EnrollmentResponseDto[]> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const enrollments = await this.enrollmentRepository.findByTrainingId(
      trainingId,
    );

    return enrollments.map(
      (enrollment) =>
        new EnrollmentResponseDto({
          id: enrollment.id,
          userId: enrollment.userId,
          trainingId: enrollment.trainingId,
          enrolledAt: enrollment.enrolledAt,
          training: new TrainingResponseDto({
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
        }),
    );
  }
}
