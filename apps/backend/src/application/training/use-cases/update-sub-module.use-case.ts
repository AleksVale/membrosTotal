import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';
import { UpdateSubModuleDto } from '../dto/update-sub-module.dto';

@Injectable()
export class UpdateSubModuleUseCase {
  constructor(
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async execute(
    id: string,
    updateDto: UpdateSubModuleDto,
  ): Promise<SubModuleResponseDto> {
    const subModule = await this.subModuleRepository.findById(id);
    if (!subModule) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

    if (subModule.isDeleted()) {
      throw new NotFoundException(`SubModule with id "${id}" not found`);
    }

    const module = await this.moduleRepository.findById(subModule.moduleId);
    if (!module) {
      throw new NotFoundException(
        `Module with id "${subModule.moduleId}" not found`,
      );
    }

    if (
      updateDto.order !== undefined &&
      updateDto.order !== subModule.order
    ) {
      const orderExists =
        await this.subModuleRepository.existsByOrderAndModuleId(
          updateDto.order,
          subModule.moduleId,
        );
      if (orderExists) {
        throw new ConflictException(
          `A submodule with order ${updateDto.order} already exists in this module`,
        );
      }
    }

    const updatedSubModule = subModule.update({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
    });

    const savedSubModule = await this.subModuleRepository.update(
      id,
      updatedSubModule,
    );

    return new SubModuleResponseDto({
      id: savedSubModule.id,
      title: savedSubModule.title,
      description: savedSubModule.description,
      order: savedSubModule.order,
      moduleId: savedSubModule.moduleId,
      createdAt: savedSubModule.createdAt,
      updatedAt: savedSubModule.updatedAt,
    });
  }
}
