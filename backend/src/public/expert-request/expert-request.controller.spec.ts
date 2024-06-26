import { Test, TestingModule } from '@nestjs/testing';
import { ExpertRequestController } from './public-expert-request.controller';
import { ExpertRequestService } from './public-expert-request.service';

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
