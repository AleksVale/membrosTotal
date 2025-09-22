import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { ModuleCollaboratorRepository } from './modules-collaborator.repository';

@Injectable()
export class ModuleCollaboratorService {
  constructor(
    private readonly moduleCollaboratorRepository: ModuleCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload, trainingId?: number) {
    console.log(`[DEBUG] Service: Finding modules for user ${user.id}, trainingId: ${trainingId}`);
    
    const result = await this.moduleCollaboratorRepository.findAll(
      user,
      trainingId,
    );
    console.log(`[DEBUG] Service: Raw modules result from repository:`, result);
    
    const modules = await Promise.all(
      result.map(async (module) => {
        if (module.thumbnail) {
          const photo = await this.awsService.getStoredObject(module.thumbnail);
          return { ...module, thumbnail: photo };
        }
        return module;
      }),
    );
    
    console.log(`[DEBUG] Service: Final modules result:`, modules);
    return modules;
  }
}
