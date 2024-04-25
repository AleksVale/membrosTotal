import { Module } from '@nestjs/common';
import { CollaboratorNotificationService } from './collaborator-notification.service';
import { CollaboratorNotificationController } from './collaborator-notification.controller';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Module({
  controllers: [CollaboratorNotificationController],
  providers: [CollaboratorNotificationService, NotificationRepository],
})
export class CollaboratorNotificationModule {}
