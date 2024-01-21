import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async findAll(options: Prisma.MeetingFindManyArgs) {
    return await this.prisma.meeting.findMany({
      ...options,
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
}
