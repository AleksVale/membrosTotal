import { Lesson } from '../entities/lesson.entity';
import { Module } from '../entities/module.entity';
import { SubModule } from '../entities/sub-module.entity';
import { Training } from '../entities/training.entity';

export interface TrainingWithHierarchy {
  training: Training;
  modules: Array<{
    module: Module;
    subModules: Array<{
      subModule: SubModule;
      lessons: Lesson[];
    }>;
  }>;
}

export abstract class TrainingRepositoryInterface {
  abstract create(training: Training): Promise<Training>;
  abstract findById(id: string): Promise<Training | null>;
  abstract findBySlug(slug: string): Promise<Training | null>;
  abstract findByIdWithHierarchy(id: string): Promise<TrainingWithHierarchy | null>;
  abstract findBySlugWithHierarchy(slug: string): Promise<TrainingWithHierarchy | null>;
  abstract findAllPublished(): Promise<Training[]>;
  abstract update(id: string, training: Training): Promise<Training>;
  abstract delete(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
