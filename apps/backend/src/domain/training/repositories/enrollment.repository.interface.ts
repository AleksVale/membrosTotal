import { Enrollment } from '../entities/enrollment.entity';

export interface CreateEnrollmentData {
  userId: string;
  trainingId: string;
  enrolledAt: Date;
}

export abstract class EnrollmentRepositoryInterface {
  abstract create(data: CreateEnrollmentData): Promise<Enrollment>;
  abstract findById(id: string): Promise<Enrollment | null>;
  abstract findByUserAndTraining(userId: string, trainingId: string): Promise<Enrollment | null>;
  abstract findByUserId(userId: string): Promise<Enrollment[]>;
  abstract findByTrainingId(trainingId: string): Promise<Enrollment[]>;
  abstract exists(userId: string, trainingId: string): Promise<boolean>;
  abstract delete(id: string): Promise<void>;
}
