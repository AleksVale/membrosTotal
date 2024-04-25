import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { NotificationResponse } from 'src/admin/admin-notification/dto/notification-response.dto';

export interface UserNotificationFilter {
  userId: number;
  page: number;
  per_page: number;
}

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NotificationUncheckedCreateInput) {
    return await this.prisma.notification.create({ data });
  }

  async find(condition: Prisma.NotificationWhereInput) {
    return await this.prisma.notification.findFirst({
      where: condition,
    });
  }

  async update(
    notification: Prisma.NotificationUpdateInput,
    where: Prisma.NotificationWhereUniqueInput,
  ) {
    return await this.prisma.notification.update({
      data: notification,
      where: where,
    });
  }

  async findAll(options: UserNotificationFilter) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<NotificationResponse, Prisma.NotificationFindManyArgs>(
      this.prisma.notification,
      {
        where: {
          NotificationUser: {
            some: {
              userId: options.userId,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          NotificationUser: {
            include: {
              User: true,
            },
          },
        },
      },
      {
        page: options.page,
      },
    );
  }

  async findHomeNotifications(userId: number) {
    return await this.prisma.notification.findMany({
      where: {
        NotificationUser: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        NotificationUser: {
          include: {
            User: true,
          },
        },
      },
      take: 5,
    });
  }

  async delete(where: Prisma.NotificationWhereUniqueInput) {
    return await this.prisma.notification.delete({ where });
  }
}
