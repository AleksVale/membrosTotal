import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRequestAdminService } from './payment-request-admin.service';

describe('PaymentRequestAdminService', () => {
  let service: PaymentRequestAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentRequestAdminService],
    }).compile();

    service = module.get<PaymentRequestAdminService>(PaymentRequestAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
