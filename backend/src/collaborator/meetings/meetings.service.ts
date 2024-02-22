import { Injectable } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingRepository } from 'src/meetings/meeting.repository';

interface IFindAllMeetingsColaborator {
  userId: number;
  page: number;
  per_page: number;
}

@Injectable()
export class MeetingsService {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  findAll({}: IFindAllMeetingsColaborator) {
    // return this.meetingRepository.findAll();
    return `This action returns all meetings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }
}
