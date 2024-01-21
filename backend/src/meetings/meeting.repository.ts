import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StatusMeeting } from '@prisma/client';
import { DateUtils } from '../utils/date';

interface IFilterMeetings {
  status?: string;
  date?: string;
  user?: number;
}

@Injectable()
export class MeetingRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MeetingCreateInput) {
    return await this.prisma.meeting.create({ data });
  }

  async find(condition: Prisma.MeetingWhereInput) {
    return await this.prisma.meeting.findFirst({
      where: condition,
    });
  }

  async update(
    meeting: Prisma.MeetingUpdateInput,
    where: Prisma.MeetingWhereUniqueInput,
  ) {
    return await this.prisma.meeting.update({
      data: meeting,
      where: where,
    });
  }

  async findAll({ date, status, user }: IFilterMeetings) {
    const where: Prisma.MeetingWhereInput = {};
    where.UserMeeting = {};
    where.UserMeeting.some = {};
    if (date)
      where.date = {
        lte: DateUtils.endOfDay(date),
        gte: DateUtils.startOfDay(date),
      };
    if (status) where.status = StatusMeeting[status];
    if (user) {
      where.UserMeeting = {
        some: {
          userId: user,
        },
      };
    }

    return await this.prisma.meeting.findMany({
      where,
      include: {
        UserMeeting: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  getMeetingUser(user: number[]) {
    return this.prisma.userMeeting.findMany({
      where: {
        userId: { in: user },
      },
      include: {
        User: true,
        Meeting: true,
      },
    });
  }

  deleteMeetingUsers(meetingId: number) {
    return this.prisma.userMeeting.deleteMany({
      where: {
        meetingId: meetingId,
      },
    });
  }
}
