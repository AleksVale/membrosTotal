import { Lesson } from '../entities/lesson.entity';

export interface CreateLessonData {
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  videoProvider: string;
  duration: number;
  subModuleId: string;
}

export abstract class LessonRepositoryInterface {
  abstract create(data: CreateLessonData): Promise<Lesson>;
  abstract findById(id: string): Promise<Lesson | null>;
  abstract findBySubModuleId(subModuleId: string): Promise<Lesson[]>;
  abstract update(id: string, lesson: Lesson): Promise<Lesson>;
  abstract delete(id: string): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
  abstract reorder(id: string, newOrder: number): Promise<Lesson>;
  abstract swapOrders(id1: string, id2: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
  abstract existsByOrderAndSubModuleId(
    order: number,
    subModuleId: string,
  ): Promise<boolean>;
}
