import { Module } from '@nestjs/common';
import { SubmoduleCollaboratorController } from './submodules-collaborator.controller';
import { AwsService } from 'src/aws/aws.service';
import { SubmoduleCollaboratorService } from './submodules-collaborator.service';

@Module({
  controllers: [SubmoduleCollaboratorController],
  providers: [
    SubmoduleCollaboratorService,
    SubmoduleCollaboratorService,
    AwsService,
  ],
})
export class SubmoduleCollaboratorModule {}
