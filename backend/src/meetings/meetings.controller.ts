import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDTO } from './dto/create-meeting.dto';
import { UpdateMeetingDTO } from './dto/update-meeting.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { MeetingResponseDTO } from './dto/meeting-response.dto';

@ApiTags('Meetings')
@Roles(['admin'])
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @ApiResponse({
    type: SuccessResponse,
    status: 201,
    description: 'The meeting has been successfully created.',
  })
  @Post()
  async create(
    @Body() createMeetingDto: CreateMeetingDTO,
  ): Promise<SuccessResponse> {
    await this.meetingsService.create(createMeetingDto);
    return {
      success: true,
    };
  }

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
  @ApiQuery({ name: 'user', required: false, description: 'Filter by user ID' })
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('user') user?: string,
  ) {
    return this.meetingsService.findAll({
      date,
      status,
      user: user ? parseInt(user) : undefined,
    });
  }

  @ApiResponse({ type: MeetingResponseDTO, status: 200 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @ApiResponse({
    type: SuccessResponse,
    status: 200,
    description: 'The meeting has been successfully updated.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDTO) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }
}
