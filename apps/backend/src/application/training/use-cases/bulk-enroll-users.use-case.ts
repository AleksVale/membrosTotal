import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class BulkEnrollUsersUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
  ) {}

  async execute(
    trainingId: string,
    userIds: string[],
  ): Promise<EnrollmentResponseDto[]> {
    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    const now = new Date();
    const enrollmentsToCreate = [];

    for (const userId of userIds) {
      const existing = await this.enrollmentRepository.findByUserAndTraining(
        userId,
        trainingId,
      );
      if (!existing) {
        enrollmentsToCreate.push({
          userId,
          trainingId,
          enrolledAt: now,
        });
      }
    }

    if (enrollmentsToCreate.length === 0) {
      const existingEnrollments = await Promise.all(
        userIds.map((userId) =>
          this.enrollmentRepository.findByUserAndTraining(userId, trainingId),
        ),
      );
      return existingEnrollments
        .filter((e): e is NonNullable<typeof e> => e !== null)
        .map(
          (e) =>
            new EnrollmentResponseDto({
              id: e.id,
              userId: e.userId,
              trainingId: e.trainingId,
              enrolledAt: e.enrolledAt,
            }),
        );
    }

    const created = await this.enrollmentRepository.bulkCreate(
      enrollmentsToCreate,
    );

    const allEnrollments = await Promise.all(
      userIds.map((userId) =>
        this.enrollmentRepository.findByUserAndTraining(userId, trainingId),
      ),
    );

    return allEnrollments
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .map(
        (e) =>
          new EnrollmentResponseDto({
            id: e.id,
            userId: e.userId,
            trainingId: e.trainingId,
            enrolledAt: e.enrolledAt,
          }),
      );
  }
}
