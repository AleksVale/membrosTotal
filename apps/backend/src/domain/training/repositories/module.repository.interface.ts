import { Module } from '../entities/module.entity';

export interface CreateModuleData {
  title: string;
  description: string | null;
  order: number;
  trainingId: string;
}

export abstract class ModuleRepositoryInterface {
  abstract create(data: CreateModuleData): Promise<Module>;
  abstract findById(id: string): Promise<Module | null>;
  abstract findByTrainingId(trainingId: string): Promise<Module[]>;
  abstract update(id: string, module: Module): Promise<Module>;
  abstract delete(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
