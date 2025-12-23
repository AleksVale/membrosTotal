import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';

@Injectable()
export class SoftDeleteModuleUseCase {
  constructor(private readonly moduleRepository: ModuleRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

    if (module.isDeleted()) {
      throw new NotFoundException(`Module with id "${id}" not found`);
    }

    await this.moduleRepository.softDelete(id);
  }
}
