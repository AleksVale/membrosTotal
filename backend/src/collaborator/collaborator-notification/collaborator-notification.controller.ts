import { Controller } from '@nestjs/common';
import { CollaboratorNotificationService } from './collaborator-notification.service';

@Controller('collaborator-notification')
export class CollaboratorNotificationController {
  constructor(private readonly collaboratorNotificationService: CollaboratorNotificationService) {}
}
