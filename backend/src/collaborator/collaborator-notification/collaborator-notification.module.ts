import { Module } from '@nestjs/common';
import { CollaboratorNotificationService } from './collaborator-notification.service';
import { CollaboratorNotificationController } from './collaborator-notification.controller';

@Module({
  controllers: [CollaboratorNotificationController],
  providers: [CollaboratorNotificationService],
})
export class CollaboratorNotificationModule {}
