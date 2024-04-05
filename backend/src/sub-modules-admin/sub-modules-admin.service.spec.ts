import { Test, TestingModule } from '@nestjs/testing';
import { SubModulesAdminService } from './sub-modules-admin.service';

describe('SubModulesAdminService', () => {
  let service: SubModulesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubModulesAdminService],
    }).compile();

    service = module.get<SubModulesAdminService>(SubModulesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
