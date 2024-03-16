import { Test, TestingModule } from '@nestjs/testing';
import { ClassesAdminService } from './classes-admin.service';

describe('ClassesAdminService', () => {
  let service: ClassesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassesAdminService],
    }).compile();

    service = module.get<ClassesAdminService>(ClassesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
