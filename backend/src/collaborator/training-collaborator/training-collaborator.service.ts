import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { TrainingCollaboratorRepository } from './training-collaborator.repository';

@Injectable()
export class TrainingCollaboratorService {
  constructor(
    private readonly trainingCollaboratorRepository: TrainingCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload) {
    console.log(`[DEBUG] Service: Finding trainings for user ${user.id}`);
    
    const result = await this.trainingCollaboratorRepository.findAll(user);
    console.log(`[DEBUG] Service: Raw result from repository:`, result);
    
    const trainings = await Promise.all(
      result.map(async (training) => {
        if (training.thumbnail) {
          const photo = await this.awsService.getStoredObject(
            training.thumbnail,
          );
          return { ...training, thumbnail: photo };
        }
        return training;
      }),
    );
    
    console.log(`[DEBUG] Service: Final trainings result:`, trainings);
    return trainings;
  }
}
