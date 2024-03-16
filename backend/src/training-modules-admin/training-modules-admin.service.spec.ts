import { Test, TestingModule } from '@nestjs/testing';
import { TrainingModulesAdminService } from './training-modules-admin.service';

describe('TrainingModulesAdminService', () => {
  let service: TrainingModulesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingModulesAdminService],
    }).compile();

    service = module.get<TrainingModulesAdminService>(TrainingModulesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
