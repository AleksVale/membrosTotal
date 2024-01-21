import { PartialType } from '@nestjs/swagger';
import { CreateMeetingDTO } from './create-meeting.dto';

export class UpdateMeetingDto extends PartialType(CreateMeetingDTO) {}
