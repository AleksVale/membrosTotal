import { Injectable } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class GetUserEnrollmentsUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<EnrollmentResponseDto[]> {
    const enrollments = await this.enrollmentRepository.findByUserId(userId);

    const enrollmentsWithTraining = await Promise.all(
      enrollments.map(async (enrollment) => {
        const training = await this.trainingRepository.findById(enrollment.trainingId);
        return new EnrollmentResponseDto({
          id: enrollment.id,
          userId: enrollment.userId,
          trainingId: enrollment.trainingId,
          enrolledAt: enrollment.enrolledAt,
          training: training
            ? new TrainingResponseDto({
                id: training.id,
                title: training.title,
                description: training.description,
                slug: training.slug,
                imageUrl: training.imageUrl,
                published: training.published,
                order: training.order,
                createdAt: training.createdAt,
                updatedAt: training.updatedAt,
              })
            : undefined,
        });
      }),
    );

    return enrollmentsWithTraining;
  }
}
