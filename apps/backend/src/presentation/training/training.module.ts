import { Module } from '@nestjs/common';
import { ApplicationTrainingModule } from '../../application/training/training.module';
import { TrainingController } from './controllers/training.controller';

@Module({
  imports: [ApplicationTrainingModule],
  controllers: [TrainingController],
})
export class PresentationTrainingModule {}
