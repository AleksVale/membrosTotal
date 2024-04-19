import { Injectable } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';

interface IFindAllMeetingsColaborator {
  userId: number;
  page: number;
  per_page: number;
  title?: string;
  status?: string;
  date?: string;
}

@Injectable()
export class MeetingsService {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  findAll({
    page,
    per_page,
    userId,
    date,
    status,
    title,
  }: IFindAllMeetingsColaborator) {
    return this.meetingRepository.findAll({
      page,
      per_page,
      date,
      status,
      title,
      user: userId,
    });
    return `This action returns all meetings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    console.log(updateMeetingDto);
    return `This action updates a #${id} meeting`;
  }
}
