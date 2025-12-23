import { Module } from '@nestjs/common';
import { InfrastructureTrainingModule } from '../../infrastructure/training/training.module';
import { CreateModuleUseCase } from './use-cases/create-module.use-case';
import { CreateTrainingUseCase } from './use-cases/create-training.use-case';
import { EnrollInTrainingUseCase } from './use-cases/enroll-in-training.use-case';
import { GetModuleUseCase } from './use-cases/get-module.use-case';
import { GetModulesByTrainingUseCase } from './use-cases/get-modules-by-training.use-case';
import { GetTrainingProgressUseCase } from './use-cases/get-training-progress.use-case';
import { GetTrainingUseCase } from './use-cases/get-training.use-case';
import { GetUserEnrollmentsUseCase } from './use-cases/get-user-enrollments.use-case';
import { ListTrainingsUseCase } from './use-cases/list-trainings.use-case';
import { UpdateLessonProgressUseCase } from './use-cases/update-lesson-progress.use-case';

@Module({
  imports: [InfrastructureTrainingModule],
  providers: [
    CreateTrainingUseCase,
    GetTrainingUseCase,
    ListTrainingsUseCase,
    EnrollInTrainingUseCase,
    GetUserEnrollmentsUseCase,
    UpdateLessonProgressUseCase,
    GetTrainingProgressUseCase,
    CreateModuleUseCase,
    GetModuleUseCase,
    GetModulesByTrainingUseCase,
  ],
  exports: [
    CreateTrainingUseCase,
    GetTrainingUseCase,
    ListTrainingsUseCase,
    EnrollInTrainingUseCase,
    GetUserEnrollmentsUseCase,
    UpdateLessonProgressUseCase,
    GetTrainingProgressUseCase,
    CreateModuleUseCase,
    GetModuleUseCase,
    GetModulesByTrainingUseCase,
  ],
})
export class ApplicationTrainingModule {}
