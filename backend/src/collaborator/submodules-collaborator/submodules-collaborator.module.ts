import { Module } from '@nestjs/common';
import { SubmoduleCollaboratorController } from './submodules-collaborator.controller';
import { AwsService } from 'src/common/aws/aws.service';
import { SubmoduleCollaboratorService } from './submodules-collaborator.service';
import { SubmoduleCollaboratorRepository } from './submodules-collaborator.repository';

@Module({
  controllers: [SubmoduleCollaboratorController],
  providers: [
    SubmoduleCollaboratorService,
    SubmoduleCollaboratorRepository,
    AwsService,
  ],
})
export class SubmoduleCollaboratorModule {}
