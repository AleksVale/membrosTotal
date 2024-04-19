import { Test, TestingModule } from '@nestjs/testing';
import { ExpertRequestController } from './expert-request.controller';
import { ExpertRequestService } from './expert-request.service';

describe('ExpertRequestController', () => {
  let controller: ExpertRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertRequestController],
      providers: [ExpertRequestService],
    }).compile();

    controller = module.get<ExpertRequestController>(ExpertRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
