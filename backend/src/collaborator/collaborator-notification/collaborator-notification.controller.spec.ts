import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorNotificationController } from './collaborator-notification.controller';
import { CollaboratorNotificationService } from './collaborator-notification.service';

describe('CollaboratorNotificationController', () => {
  let controller: CollaboratorNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorNotificationController],
      providers: [CollaboratorNotificationService],
    }).compile();

    controller = module.get<CollaboratorNotificationController>(CollaboratorNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
