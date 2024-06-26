import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDTO } from './dto/create-meeting.dto';
import { UpdateMeetingDTO } from './dto/update-meeting.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../public/auth/roles/roles.decorator';
import { JwtAuthGuard } from '../../public/auth/jwt-auth.guard';
import { RoleGuard } from '../../public/auth/role/role.guard';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { MeetingResponseDTO } from './dto/meeting-response.dto';
import { StatusMeeting } from '@prisma/client';

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
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by meeting title',
  })
  @ApiQuery({ name: 'user', required: false, description: 'Filter by user ID' })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('user') user?: string,
  ) {
    return this.meetingsService.findAll({
      title,
      date,
      status,
      user: user ? parseInt(user) : undefined,
      page,
      per_page,
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
  @Patch(':id/cancel')
  async cancelMeeting(@Param('id') id: string) {
    const result = await this.meetingsService.changeStatus(
      +id,
      StatusMeeting.CANCELED,
    );
    return {
      success: !!result,
    };
  }
  @Patch(':id/finish')
  async finishMeeting(@Param('id') id: string) {
    const result = await this.meetingsService.changeStatus(
      +id,
      StatusMeeting.DONE,
    );
    return {
      success: !!result,
    };
  }
}
