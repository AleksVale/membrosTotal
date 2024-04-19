import { Test, TestingModule } from '@nestjs/testing';
import { LessonsAdminService } from './lessons-admin.service';

describe('LessonsAdminService', () => {
  let service: LessonsAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonsAdminService],
    }).compile();

    service = module.get<LessonsAdminService>(LessonsAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
