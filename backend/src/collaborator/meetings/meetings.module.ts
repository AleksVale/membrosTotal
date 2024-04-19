import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingRepository],
})
export class MeetingsModule {}
