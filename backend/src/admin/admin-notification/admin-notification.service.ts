import { Injectable } from '@nestjs/common';
import { CreateNotificationAdminDTO } from './dto/create-admin-notification.dto';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}
  create(createAdminNotificationDto: CreateNotificationAdminDTO) {
    const entity: Prisma.NotificationUncheckedCreateInput = {
      description: createAdminNotificationDto.message,
      title: createAdminNotificationDto.title,
      NotificationUser: {
        createMany: {
          data: createAdminNotificationDto.users.map((user) => {
            return { userId: user };
          }),
        },
      },
    };
    return this.notificationRepository.create(entity);
  }

  findAll() {
    return `This action returns all adminNotification`;
  }

  findOne(id: number) {
    return this.notificationRepository.find({ id });
  }

  remove(id: number) {
    return this.notificationRepository.delete({ id });
  }
}
