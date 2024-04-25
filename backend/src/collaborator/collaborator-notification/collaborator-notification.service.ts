import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Injectable()
export class CollaboratorNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}
  readNotification(id: number, currentUser: TokenPayload) {
    return this.notificationRepository.readNotification(id, currentUser.id);
  }
}
