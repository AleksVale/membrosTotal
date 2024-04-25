import { Controller, Patch, UseGuards } from '@nestjs/common';
import { CollaboratorNotificationService } from './collaborator-notification.service';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { SuccessResponse } from 'src/utils/success-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Notification-Collaborator')
@Controller('collaborator-notification')
export class CollaboratorNotificationController {
  constructor(
    private readonly collaboratorNotificationService: CollaboratorNotificationService,
  ) {}

  @ApiResponse({ type: SuccessResponse })
  @Patch(':id/read')
  async readNotification(id: number, @CurrentUser() currentUser: TokenPayload) {
    await this.collaboratorNotificationService.readNotification(
      id,
      currentUser,
    );
    return { success: true };
  }
}
