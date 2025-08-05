import { Module } from '@nestjs/common';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, MeetingRepository, NotificationRepository, PrismaService],
})
export class HomeModule {}
