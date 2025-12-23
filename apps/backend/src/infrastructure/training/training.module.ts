import { Module } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../domain/training/repositories/enrollment.repository.interface';
import { ModuleRepositoryInterface } from '../../domain/training/repositories/module.repository.interface';
import { SubModuleRepositoryInterface } from '../../domain/training/repositories/sub-module.repository.interface';
import { TrainingRepositoryInterface } from '../../domain/training/repositories/training.repository.interface';
import { UserProgressRepositoryInterface } from '../../domain/training/repositories/user-progress.repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { ModuleRepository } from './repositories/module.repository';
import { SubModuleRepository } from './repositories/sub-module.repository';
import { TrainingRepository } from './repositories/training.repository';
import { UserProgressRepository } from './repositories/user-progress.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: TrainingRepositoryInterface,
      useClass: TrainingRepository,
    },
    {
      provide: ModuleRepositoryInterface,
      useClass: ModuleRepository,
    },
    {
      provide: SubModuleRepositoryInterface,
      useClass: SubModuleRepository,
    },
    {
      provide: EnrollmentRepositoryInterface,
      useClass: EnrollmentRepository,
    },
    {
      provide: UserProgressRepositoryInterface,
      useClass: UserProgressRepository,
    },
  ],
  exports: [
    TrainingRepositoryInterface,
    ModuleRepositoryInterface,
    SubModuleRepositoryInterface,
    EnrollmentRepositoryInterface,
    UserProgressRepositoryInterface,
  ],
})
export class InfrastructureTrainingModule {}
