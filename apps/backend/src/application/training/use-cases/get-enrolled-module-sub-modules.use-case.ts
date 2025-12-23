import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../../domain/training/repositories/sub-module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { SubModuleResponseDto } from '../dto/sub-module-response.dto';

@Injectable()
export class GetEnrolledModuleSubModulesUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly subModuleRepository: SubModuleRepositoryInterface,
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
  ) {}

  async execute(
    userId: string,
    moduleId: string,
  ): Promise<SubModuleResponseDto[]> {
    const module = await this.moduleRepository.findById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with id "${moduleId}" not found`);
    }

    const training = await this.trainingRepository.findById(module.trainingId);
    if (!training) {
      throw new NotFoundException(
        `Training with id "${module.trainingId}" not found`,
      );
    }

    const isEnrolled = await this.enrollmentRepository.exists(
      userId,
      training.id,
    );
    if (!isEnrolled) {
      throw new ForbiddenException(
        `User is not enrolled in training with id "${training.id}"`,
      );
    }

    if (!training.published) {
      throw new ForbiddenException(
        `Training with id "${training.id}" is not published`,
      );
    }

    const subModules = await this.subModuleRepository.findByModuleId(moduleId);

    return subModules.map(
      (subModule) =>
        new SubModuleResponseDto({
          id: subModule.id,
          title: subModule.title,
          description: subModule.description,
          order: subModule.order,
          moduleId: subModule.moduleId,
          createdAt: subModule.createdAt,
          updatedAt: subModule.updatedAt,
        }),
    );
  }
}
