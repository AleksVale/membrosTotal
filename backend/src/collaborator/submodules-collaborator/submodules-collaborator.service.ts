import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { AwsService } from 'src/common/aws/aws.service';
import { SubmoduleCollaboratorRepository } from './submodules-collaborator.repository';

@Injectable()
export class SubmoduleCollaboratorService {
  constructor(
    private readonly submoduleCollaboratorRepository: SubmoduleCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload, moduleId?: number) {
    const result = await this.submoduleCollaboratorRepository.findAll(
      user,
      moduleId,
    );
    const submodules = await Promise.all(
      result.map(async (submodule) => {
        if (submodule.thumbnail) {
          const photo = await this.awsService.getStoredObject(
            submodule.thumbnail,
          );
          return { ...submodule, thumbnail: photo };
        }
        return submodule;
      }),
    );
    return submodules;
  }
}
