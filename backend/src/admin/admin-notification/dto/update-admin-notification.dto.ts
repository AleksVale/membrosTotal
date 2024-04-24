import { PartialType } from '@nestjs/swagger';
import { CreateAdminNotificationDto } from './create-admin-notification.dto';

export class UpdateAdminNotificationDto extends PartialType(CreateAdminNotificationDto) {}
