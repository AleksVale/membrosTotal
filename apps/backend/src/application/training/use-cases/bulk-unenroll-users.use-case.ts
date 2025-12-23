import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';

@Injectable()
export class BulkUnenrollUsersUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(trainingId: string, userIds: string[]): Promise<number> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const enrollments = await Promise.all(
      userIds.map((userId) =>
        this.enrollmentRepository.findByUserAndTraining(userId, trainingId),
      ),
    );

    const enrollmentIds = enrollments
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .map((e) => e.id);

    if (enrollmentIds.length === 0) {
      return 0;
    }

    await this.enrollmentRepository.bulkDelete(enrollmentIds);

    return enrollmentIds.length;
  }
}
