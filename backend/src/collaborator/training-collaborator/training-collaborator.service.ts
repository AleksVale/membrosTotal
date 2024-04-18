import { Injectable } from '@nestjs/common';
import { TrainingCollaboratorRepository } from './training-collaborator.repository';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class TrainingCollaboratorService {
  constructor(
    private readonly trainingCollaboratorRepository: TrainingCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload) {
    const result = await this.trainingCollaboratorRepository.findAll(user);
    const trainings = await Promise.all(
      result.map(async (training) => {
        if (training.thumbnail) {
          const photo = await this.awsService.getStoredObject(training.thumbnail);
          return { ...training, thumbnail: photo };
        }
        return training;
      }),
    );
    return trainings;
  }
}
