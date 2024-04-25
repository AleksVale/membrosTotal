import { Injectable } from '@nestjs/common';
import { CreateNotificationAdminDTO } from './dto/create-admin-notification.dto';
import {
  NotificationRepository,
  UserNotificationFilter,
} from 'src/repositories/notification.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}
  create(createAdminNotificationDto: CreateNotificationAdminDTO) {
    const entity: Prisma.NotificationUncheckedCreateInput = {
      description: createAdminNotificationDto.description,
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

  findAll(option: UserNotificationFilter) {
    return this.notificationRepository.findAll(option);
  }

  findOne(id: number) {
    return this.notificationRepository.find({ id });
  }

  remove(id: number) {
    return this.notificationRepository.delete({ id });
  }
}
