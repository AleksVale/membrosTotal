import { Injectable } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { TrainingResponseDto } from '../dto/training-response.dto';

@Injectable()
export class GetEnrolledTrainingsUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<TrainingResponseDto[]> {
    const enrollments = await this.enrollmentRepository.findByUserId(userId);

    const trainings = await Promise.all(
      enrollments.map(async (enrollment) => {
        const training = await this.trainingRepository.findById(
          enrollment.trainingId,
        );
        return training;
      }),
    );

    const publishedTrainings = trainings.filter(
      (training): training is NonNullable<typeof training> =>
        training !== null && training.published,
    );

    return publishedTrainings.map(
      (training) =>
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
