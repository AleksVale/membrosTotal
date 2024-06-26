import { Test, TestingModule } from '@nestjs/testing';
import { AdminNotificationController } from './admin-notification.controller';
import { AdminNotificationService } from './admin-notification.service';

describe('AdminNotificationController', () => {
  let controller: AdminNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminNotificationController],
      providers: [AdminNotificationService],
    }).compile();

    controller = module.get<AdminNotificationController>(AdminNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
