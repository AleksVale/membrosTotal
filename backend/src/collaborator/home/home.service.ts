import { Injectable } from '@nestjs/common';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly meetingsRepository: MeetingRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getInitialData(currentUser: TokenPayload) {
    const meetings = await this.meetingsRepository.findHomeMeetings(
      currentUser.id,
    );
    const notifications = await this.notificationRepository.findAll({
      userId: currentUser.id,
      per_page: 5,
      page: 1,
    });
    return { meetings, notifications };
  }
}
