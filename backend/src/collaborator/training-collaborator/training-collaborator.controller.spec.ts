import { Test, TestingModule } from '@nestjs/testing';
import { TrainingCollaboratorController } from './training-collaborator.controller';
import { TrainingCollaboratorService } from './training-collaborator.service';

describe('TrainingCollaboratorController', () => {
  let controller: TrainingCollaboratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingCollaboratorController],
      providers: [TrainingCollaboratorService],
    }).compile();

    controller = module.get<TrainingCollaboratorController>(TrainingCollaboratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
