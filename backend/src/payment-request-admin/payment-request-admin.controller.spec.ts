import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRequestAdminController } from './payment-request-admin.controller';
import { PaymentRequestAdminService } from './payment-request-admin.service';

describe('PaymentRequestAdminController', () => {
  let controller: PaymentRequestAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentRequestAdminController],
      providers: [PaymentRequestAdminService],
    }).compile();

    controller = module.get<PaymentRequestAdminController>(PaymentRequestAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
