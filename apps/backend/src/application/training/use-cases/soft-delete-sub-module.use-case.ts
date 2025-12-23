import { Injectable, NotFoundException } from '@nestjs/common';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';

@Injectable()
export class SoftDeleteSubModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const subModule = await this.subModuleRepository.findById(id);
    if (!subModule) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

    if (subModule.isDeleted()) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

    await this.subModuleRepository.softDelete(id);
  }
}
