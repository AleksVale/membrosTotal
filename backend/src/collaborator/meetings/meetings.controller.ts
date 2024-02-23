import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { RoleGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MeetingResponseDTO } from 'src/meetings/dto/meeting-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@Controller('collaborator/meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @ApiResponse({ type: [MeetingResponseDTO], status: 200 })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by meeting status',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by meeting date',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by meeting title',
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @CurrentUser() user: TokenPayload,
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.meetingsService.findAll({
      page,
      per_page,
      userId: user.id,
      date,
      status,
      title,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }
}
