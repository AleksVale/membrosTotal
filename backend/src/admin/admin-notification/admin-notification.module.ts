import { Module } from '@nestjs/common';
import { AdminNotificationService } from './admin-notification.service';
import { AdminNotificationController } from './admin-notification.controller';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Module({
  controllers: [AdminNotificationController],
  providers: [AdminNotificationService, NotificationRepository],
})
export class AdminNotificationModule {}
