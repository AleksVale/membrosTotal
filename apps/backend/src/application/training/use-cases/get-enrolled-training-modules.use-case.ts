import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { ModuleRepositoryInterface } from '../../../domain/training/repositories/module.repository.interface';
import { TrainingRepositoryInterface } from '../../../domain/training/repositories/training.repository.interface';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class GetEnrolledTrainingModulesUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
    private readonly trainingRepository: TrainingRepositoryInterface,
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async execute(
    userId: string,
    trainingId: string,
  ): Promise<ModuleResponseDto[]> {
    const isEnrolled = await this.enrollmentRepository.exists(
      userId,
      trainingId,
    );
    if (!isEnrolled) {
      throw new ForbiddenException(
        `User is not enrolled in training with id "${trainingId}"`,
      );
    }

    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new NotFoundException(`Training with id "${trainingId}" not found`);
    }

    if (!training.published) {
      throw new ForbiddenException(
        `Training with id "${trainingId}" is not published`,
      );
    }

    const modules = await this.moduleRepository.findByTrainingId(trainingId);

    return modules.map(
      (module) =>
        new ModuleResponseDto({
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          trainingId: module.trainingId,
          createdAt: module.createdAt,
          updatedAt: module.updatedAt,
        }),
    );
  }
}
