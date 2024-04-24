import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorNotificationService } from './collaborator-notification.service';

describe('CollaboratorNotificationService', () => {
  let service: CollaboratorNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaboratorNotificationService],
    }).compile();

    service = module.get<CollaboratorNotificationService>(CollaboratorNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
