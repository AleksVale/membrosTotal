import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDTO } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';

@ApiTags('Meetings')
@Roles(['admin'])
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDTO) {
    return this.meetingsService.create(createMeetingDto);
  }

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(+id);
  }
}
