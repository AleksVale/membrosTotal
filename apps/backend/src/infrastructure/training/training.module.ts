import { Module } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../domain/training/repositories/enrollment.repository.interface';
import { TrainingRepositoryInterface } from '../../domain/training/repositories/training.repository.interface';
import { UserProgressRepositoryInterface } from '../../domain/training/repositories/user-progress.repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';
import { EnrollmentRepository } from './repositories/enrollment.repository';
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
    EnrollmentRepositoryInterface,
    UserProgressRepositoryInterface,
  ],
})
export class InfrastructureTrainingModule {}
