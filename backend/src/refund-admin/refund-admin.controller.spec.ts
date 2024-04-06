import { Test, TestingModule } from '@nestjs/testing';
import { RefundAdminController } from './refund-admin.controller';
import { RefundAdminService } from './refund-admin.service';

describe('RefundAdminController', () => {
  let controller: RefundAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundAdminController],
      providers: [RefundAdminService],
    }).compile();

    controller = module.get<RefundAdminController>(RefundAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
