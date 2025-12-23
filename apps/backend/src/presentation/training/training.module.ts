import { Module } from '@nestjs/common';
import { ApplicationTrainingModule } from '../../application/training/training.module';
import { ModuleController } from './controllers/module.controller';
import { TrainingController } from './controllers/training.controller';

@Module({
  imports: [ApplicationTrainingModule],
  controllers: [TrainingController, ModuleController],
})
export class PresentationTrainingModule {}
