import { Test, TestingModule } from '@nestjs/testing';
import { RefundAdminService } from './refund-admin.service';

describe('RefundAdminService', () => {
  let service: RefundAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundAdminService],
    }).compile();

    service = module.get<RefundAdminService>(RefundAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
