import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminNotificationService } from './admin-notification.service';
import { CreateNotificationAdminDTO } from './dto/create-admin-notification.dto';
import { NotificationResponse } from './dto/notification-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@ApiTags('Notification-Admin')
@Controller('admin-notification')
export class AdminNotificationController {
  constructor(
    private readonly adminNotificationService: AdminNotificationService,
  ) {}

  @Post()
  create(@Body() createAdminNotificationDto: CreateNotificationAdminDTO) {
    return this.adminNotificationService.create(createAdminNotificationDto);
  }

  @Get()
  @ApiOkResponsePaginated(NotificationResponse)
  findAll(
    @Query('page') page: number,
    @Query('per_page') per_page: number,
    @Query('userId') userId: number,
  ) {
    return this.adminNotificationService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: NotificationResponse,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<NotificationResponse | null> {
    return this.adminNotificationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminNotificationService.remove(+id);
  }
}
