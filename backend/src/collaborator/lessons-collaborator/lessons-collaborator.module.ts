import { Module } from '@nestjs/common';
import { LessonCollaboratorController } from './lessons-collaborator.controller';
import { AwsService } from 'src/aws/aws.service';
import { LessonCollaboratorService } from './lessons-collaborator.service';
import { LessonCollaboratorRepository } from './lessons-collaborator.repository';

@Module({
  controllers: [LessonCollaboratorController],
  providers: [
    LessonCollaboratorService,
    LessonCollaboratorRepository,
    AwsService,
  ],
})
export class LessonCollaboratorModule {}
