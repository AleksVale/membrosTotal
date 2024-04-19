import { Injectable } from '@nestjs/common';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class HomeService {
  constructor(private readonly meetingsRepository: MeetingRepository) {}

  async getInitialData(currentUser: TokenPayload) {
    const meetings = await this.meetingsRepository.findHomeMeetings(
      currentUser.id,
    );
    return { meetings };
  }
}
