import { Injectable } from '@nestjs/common';
import { ModuleCollaboratorRepository } from './modules-collaborator.repository';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { AwsService } from 'src/common/aws/aws.service';

@Injectable()
export class ModuleCollaboratorService {
  constructor(
    private readonly moduleCollaboratorRepository: ModuleCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload, trainingId?: number) {
    const result = await this.moduleCollaboratorRepository.findAll(
      user,
      trainingId,
    );
    const modules = await Promise.all(
      result.map(async (module) => {
        if (module.thumbnail) {
          const photo = await this.awsService.getStoredObject(module.thumbnail);
          return { ...module, thumbnail: photo };
        }
        return module;
      }),
    );
    return modules;
  }
}
