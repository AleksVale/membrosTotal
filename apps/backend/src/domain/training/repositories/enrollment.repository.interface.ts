import { Enrollment } from '../entities/enrollment.entity';

export abstract class EnrollmentRepositoryInterface {
  abstract create(enrollment: Enrollment): Promise<Enrollment>;
  abstract findById(id: string): Promise<Enrollment | null>;
  abstract findByUserAndTraining(userId: string, trainingId: string): Promise<Enrollment | null>;
  abstract findByUserId(userId: string): Promise<Enrollment[]>;
  abstract findByTrainingId(trainingId: string): Promise<Enrollment[]>;
  abstract exists(userId: string, trainingId: string): Promise<boolean>;
  abstract delete(id: string): Promise<void>;
}
