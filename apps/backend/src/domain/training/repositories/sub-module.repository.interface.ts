import { SubModule } from '../entities/sub-module.entity';

export interface CreateSubModuleData {
  title: string;
  description: string | null;
  order: number;
  moduleId: string;
}

export abstract class SubModuleRepositoryInterface {
  abstract create(data: CreateSubModuleData): Promise<SubModule>;
  abstract findById(id: string): Promise<SubModule | null>;
  abstract findByModuleId(moduleId: string): Promise<SubModule[]>;
  abstract update(id: string, subModule: SubModule): Promise<SubModule>;
  abstract delete(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
