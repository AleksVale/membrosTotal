import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';

@Module({
  controllers: [HomeController],
  providers: [HomeService, MeetingRepository],
})
export class HomeModule {}
