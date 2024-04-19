import { Module } from '@nestjs/common';
import { ModuleCollaboratorService } from './modules-collaborator.service';
import { ModuleCollaboratorController } from './modules-collaborator.controller';
import { ModuleCollaboratorRepository } from './modules-collaborator.repository';
import { AwsService } from 'src/common/aws/aws.service';

@Module({
  controllers: [ModuleCollaboratorController],
  providers: [
    ModuleCollaboratorService,
    ModuleCollaboratorRepository,
    AwsService,
  ],
})
export class ModuleCollaboratorModule {}
