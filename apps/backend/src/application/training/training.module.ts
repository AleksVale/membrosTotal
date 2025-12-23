import { Module } from '@nestjs/common';
import { InfrastructureTrainingModule } from '../../infrastructure/training/training.module';
import { BulkEnrollUsersUseCase } from './use-cases/bulk-enroll-users.use-case';
import { BulkUnenrollUsersUseCase } from './use-cases/bulk-unenroll-users.use-case';
import { CreateLessonUseCase } from './use-cases/create-lesson.use-case';
import { CreateModuleUseCase } from './use-cases/create-module.use-case';
import { CreateSubModuleUseCase } from './use-cases/create-sub-module.use-case';
import { CreateTrainingUseCase } from './use-cases/create-training.use-case';
import { DeleteEnrollmentUseCase } from './use-cases/delete-enrollment.use-case';
import { EnrollInTrainingUseCase } from './use-cases/enroll-in-training.use-case';
import { GetEnrolledLessonProgressUseCase } from './use-cases/get-enrolled-lesson-progress.use-case';
import { GetEnrolledLessonUseCase } from './use-cases/get-enrolled-lesson.use-case';
import { GetEnrolledModuleSubModulesUseCase } from './use-cases/get-enrolled-module-sub-modules.use-case';
import { GetEnrolledSubModuleLessonsUseCase } from './use-cases/get-enrolled-sub-module-lessons.use-case';
import { GetEnrolledTrainingModulesUseCase } from './use-cases/get-enrolled-training-modules.use-case';
import { GetEnrolledTrainingProgressUseCase } from './use-cases/get-enrolled-training-progress.use-case';
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
import { ListAllEnrollmentsUseCase } from './use-cases/list-all-enrollments.use-case';
import { ListTrainingEnrollmentsUseCase } from './use-cases/list-training-enrollments.use-case';
import { ListTrainingsUseCase } from './use-cases/list-trainings.use-case';
import { ListUserEnrollmentsUseCase } from './use-cases/list-user-enrollments.use-case';
import { ReorderLessonUseCase } from './use-cases/reorder-lesson.use-case';
import { ReorderModuleUseCase } from './use-cases/reorder-module.use-case';
import { ReorderSubModuleUseCase } from './use-cases/reorder-sub-module.use-case';
import { ReorderTrainingUseCase } from './use-cases/reorder-training.use-case';
import { SoftDeleteLessonUseCase } from './use-cases/soft-delete-lesson.use-case';
import { SoftDeleteModuleUseCase } from './use-cases/soft-delete-module.use-case';
import { SoftDeleteSubModuleUseCase } from './use-cases/soft-delete-sub-module.use-case';
import { SoftDeleteTrainingUseCase } from './use-cases/soft-delete-training.use-case';
import { SwapLessonOrdersUseCase } from './use-cases/swap-lesson-orders.use-case';
import { SwapModuleOrdersUseCase } from './use-cases/swap-module-orders.use-case';
import { SwapSubModuleOrdersUseCase } from './use-cases/swap-sub-module-orders.use-case';
import { SwapTrainingOrdersUseCase } from './use-cases/swap-training-orders.use-case';
import { UnenrollUserUseCase } from './use-cases/unenroll-user.use-case';
import { UpdateEnrolledLessonProgressUseCase } from './use-cases/update-enrolled-lesson-progress.use-case';
import { UpdateLessonProgressUseCase } from './use-cases/update-lesson-progress.use-case';
import { UpdateLessonUseCase } from './use-cases/update-lesson.use-case';
import { UpdateModuleUseCase } from './use-cases/update-module.use-case';
import { UpdateSubModuleUseCase } from './use-cases/update-sub-module.use-case';
import { UpdateTrainingUseCase } from './use-cases/update-training.use-case';
import { WatchEnrolledLessonUseCase } from './use-cases/watch-enrolled-lesson.use-case';

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
    GetEnrolledLessonUseCase,
    UpdateTrainingUseCase,
    UpdateModuleUseCase,
    UpdateSubModuleUseCase,
    UpdateLessonUseCase,
    SoftDeleteTrainingUseCase,
    SoftDeleteModuleUseCase,
    SoftDeleteSubModuleUseCase,
    SoftDeleteLessonUseCase,
    UpdateEnrolledLessonProgressUseCase,
    WatchEnrolledLessonUseCase,
    GetEnrolledLessonProgressUseCase,
    GetEnrolledTrainingProgressUseCase,
    ReorderTrainingUseCase,
    SwapTrainingOrdersUseCase,
    ReorderModuleUseCase,
    SwapModuleOrdersUseCase,
    ReorderSubModuleUseCase,
    SwapSubModuleOrdersUseCase,
    ReorderLessonUseCase,
    SwapLessonOrdersUseCase,
    ListAllEnrollmentsUseCase,
    ListTrainingEnrollmentsUseCase,
    ListUserEnrollmentsUseCase,
    DeleteEnrollmentUseCase,
    UnenrollUserUseCase,
    BulkEnrollUsersUseCase,
    BulkUnenrollUsersUseCase,
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
    GetEnrolledLessonUseCase,
    UpdateTrainingUseCase,
    UpdateModuleUseCase,
    UpdateSubModuleUseCase,
    UpdateLessonUseCase,
    SoftDeleteTrainingUseCase,
    SoftDeleteModuleUseCase,
    SoftDeleteSubModuleUseCase,
    SoftDeleteLessonUseCase,
    UpdateEnrolledLessonProgressUseCase,
    WatchEnrolledLessonUseCase,
    GetEnrolledLessonProgressUseCase,
    GetEnrolledTrainingProgressUseCase,
    ReorderTrainingUseCase,
    SwapTrainingOrdersUseCase,
    ReorderModuleUseCase,
    SwapModuleOrdersUseCase,
    ReorderSubModuleUseCase,
    SwapSubModuleOrdersUseCase,
    ReorderLessonUseCase,
    SwapLessonOrdersUseCase,
    ListAllEnrollmentsUseCase,
    ListTrainingEnrollmentsUseCase,
    ListUserEnrollmentsUseCase,
    DeleteEnrollmentUseCase,
    UnenrollUserUseCase,
    BulkEnrollUsersUseCase,
    BulkUnenrollUsersUseCase,
  ],
})
export class ApplicationTrainingModule {}
