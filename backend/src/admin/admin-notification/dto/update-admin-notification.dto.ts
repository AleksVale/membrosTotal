import { PartialType } from '@nestjs/swagger';
import { CreateNotificationAdminDTO } from './create-admin-notification.dto';

export class UpdateAdminNotificationDto extends PartialType(
  CreateNotificationAdminDTO,
) {}
