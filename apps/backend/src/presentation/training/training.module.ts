import { Module } from '@nestjs/common';
import { ApplicationTrainingModule } from '../../application/training/training.module';
import { CollaboratorTrainingController } from './controllers/collaborator-training.controller';
import { EnrollmentController } from './controllers/enrollment.controller';
import { LessonController } from './controllers/lesson.controller';
import { ModuleController } from './controllers/module.controller';
import { SubModuleController } from './controllers/sub-module.controller';
import { TrainingController } from './controllers/training.controller';

@Module({
  imports: [ApplicationTrainingModule],
  controllers: [
    TrainingController,
    ModuleController,
    SubModuleController,
    LessonController,
    CollaboratorTrainingController,
    EnrollmentController,
  ],
})
export class PresentationTrainingModule {}
