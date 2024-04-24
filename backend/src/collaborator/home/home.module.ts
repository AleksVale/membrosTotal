import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Module({
  controllers: [HomeController],
  providers: [HomeService, MeetingRepository, NotificationRepository],
})
export class HomeModule {}
