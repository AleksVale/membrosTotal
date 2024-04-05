import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { MeetingRepository } from './meeting.repository';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingRepository],
})
export class MeetingsModule {}
