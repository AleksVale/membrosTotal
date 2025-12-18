import { UserProgress } from '../entities/user-progress.entity';

export interface CreateUserProgressData {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  lastWatchedAt: Date;
}

export abstract class UserProgressRepositoryInterface {
  abstract create(data: CreateUserProgressData): Promise<UserProgress>;
  abstract upsert(data: CreateUserProgressData): Promise<UserProgress>;
  abstract findById(id: string): Promise<UserProgress | null>;
  abstract findByUserAndLesson(userId: string, lessonId: string): Promise<UserProgress | null>;
  abstract findByUserId(userId: string): Promise<UserProgress[]>;
  abstract findByLessonId(lessonId: string): Promise<UserProgress[]>;
  abstract findCompletedLessonsByUser(userId: string, lessonIds: string[]): Promise<UserProgress[]>;
  abstract update(id: string, data: Partial<CreateUserProgressData>): Promise<UserProgress>;
  abstract delete(id: string): Promise<void>;
}
