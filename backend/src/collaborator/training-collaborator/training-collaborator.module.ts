import { Module } from '@nestjs/common';
import { TrainingCollaboratorService } from './training-collaborator.service';
import { TrainingCollaboratorController } from './training-collaborator.controller';
import { TrainingCollaboratorRepository } from './training-collaborator.repository';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [TrainingCollaboratorController],
  providers: [
    TrainingCollaboratorService,
    TrainingCollaboratorRepository,
    AwsService,
  ],
})
export class TrainingCollaboratorModule {}
