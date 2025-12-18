import { UserProgress } from '../entities/user-progress.entity';

export abstract class UserProgressRepositoryInterface {
  abstract create(progress: UserProgress): Promise<UserProgress>;
  abstract upsert(progress: UserProgress): Promise<UserProgress>;
  abstract findById(id: string): Promise<UserProgress | null>;
  abstract findByUserAndLesson(userId: string, lessonId: string): Promise<UserProgress | null>;
  abstract findByUserId(userId: string): Promise<UserProgress[]>;
  abstract findByLessonId(lessonId: string): Promise<UserProgress[]>;
  abstract findCompletedLessonsByUser(userId: string, lessonIds: string[]): Promise<UserProgress[]>;
  abstract update(id: string, progress: UserProgress): Promise<UserProgress>;
  abstract delete(id: string): Promise<void>;
}
