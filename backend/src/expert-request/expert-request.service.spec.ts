import { Test, TestingModule } from '@nestjs/testing';
import { ExpertRequestService } from './expert-request.service';

describe('ExpertRequestService', () => {
  let service: ExpertRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertRequestService],
    }).compile();

    service = module.get<ExpertRequestService>(ExpertRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
