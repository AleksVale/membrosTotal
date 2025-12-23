import { Module } from '@nestjs/common';
import { InfrastructureTrainingModule } from '../../infrastructure/training/training.module';
import { CreateLessonUseCase } from './use-cases/create-lesson.use-case';
import { CreateModuleUseCase } from './use-cases/create-module.use-case';
import { CreateSubModuleUseCase } from './use-cases/create-sub-module.use-case';
import { CreateTrainingUseCase } from './use-cases/create-training.use-case';
import { EnrollInTrainingUseCase } from './use-cases/enroll-in-training.use-case';
import { GetEnrolledModuleSubModulesUseCase } from './use-cases/get-enrolled-module-sub-modules.use-case';
import { GetEnrolledSubModuleLessonsUseCase } from './use-cases/get-enrolled-sub-module-lessons.use-case';
import { GetEnrolledTrainingModulesUseCase } from './use-cases/get-enrolled-training-modules.use-case';
import { GetEnrolledTrainingsUseCase } from './use-cases/get-enrolled-trainings.use-case';
import { GetLessonUseCase } from './use-cases/get-lesson.use-case';
import { GetLessonsBySubModuleUseCase } from './use-cases/get-lessons-by-sub-module.use-case';
import { GetModuleUseCase } from './use-cases/get-module.use-case';
import { GetModulesByTrainingUseCase } from './use-cases/get-modules-by-training.use-case';
import { GetSubModuleUseCase } from './use-cases/get-sub-module.use-case';
import { GetSubModulesByModuleUseCase } from './use-cases/get-sub-modules-by-module.use-case';
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
    CreateSubModuleUseCase,
    GetSubModuleUseCase,
    GetSubModulesByModuleUseCase,
    CreateLessonUseCase,
    GetLessonUseCase,
    GetLessonsBySubModuleUseCase,
    GetEnrolledTrainingsUseCase,
    GetEnrolledTrainingModulesUseCase,
    GetEnrolledModuleSubModulesUseCase,
    GetEnrolledSubModuleLessonsUseCase,
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
    CreateSubModuleUseCase,
    GetSubModuleUseCase,
    GetSubModulesByModuleUseCase,
    CreateLessonUseCase,
    GetLessonUseCase,
    GetLessonsBySubModuleUseCase,
    GetEnrolledTrainingsUseCase,
    GetEnrolledTrainingModulesUseCase,
    GetEnrolledModuleSubModulesUseCase,
    GetEnrolledSubModuleLessonsUseCase,
  ],
})
export class ApplicationTrainingModule {}
