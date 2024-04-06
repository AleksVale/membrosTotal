import { Test, TestingModule } from '@nestjs/testing';
import { TrainingCollaboratorService } from './training-collaborator.service';

describe('TrainingCollaboratorService', () => {
  let service: TrainingCollaboratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingCollaboratorService],
    }).compile();

    service = module.get<TrainingCollaboratorService>(TrainingCollaboratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
