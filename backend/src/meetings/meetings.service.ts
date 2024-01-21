import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMeetingDTO } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingRepository } from './meeting.repository';
import { DateUtils } from 'src/utils/date';
import { Prisma } from '@prisma/client';

@Injectable()
export class MeetingsService {
  constructor(private meetingRepository: MeetingRepository) {}

  async create(createMeetingDto: CreateMeetingDTO) {
    await this.validateUserMeeting(
      createMeetingDto.users,
      createMeetingDto.title,
      createMeetingDto.meetingDate,
    );
    try {
      const createInput: Prisma.MeetingCreateInput = {
        title: createMeetingDto.title,
        link: createMeetingDto.link,
        date: DateUtils.stringToDate(createMeetingDto.meetingDate),
        UserMeeting: {
          createMany: {
            data: createMeetingDto.users.map((user) => ({ userId: user })),
          },
        },
      };
      await this.meetingRepository.create(createInput);
    } catch (error) {
      throw new InternalServerErrorException('Erro interno no servidor');
    }
    return 'This action adds a new meeting';
  }

  private async validateUserMeeting(
    users: number[],
    title: string,
    date: string,
  ) {
    const userMeeting = await this.meetingRepository.getMeetingUser(users);
    if (userMeeting.length > 0) {
      // Se houver usuários na reunião, lançar uma exceção BadRequest com detalhes
      const errorDetails = userMeeting.map((userMeeting) => {
        if (
          userMeeting.Meeting.title === title &&
          DateUtils.isEqual(
            userMeeting.Meeting.date,
            DateUtils.stringToDate(date),
          )
        ) {
          const userName = `${userMeeting.User.firstName} ${userMeeting.User.lastName}`;
          const meetingTitle = userMeeting.Meeting.title;
          console.log('aqui');
          return {
            userId: userMeeting.userId,
            meetingId: userMeeting.meetingId,
            errorMessage: `Usuário '${userName}' está na reunião: '${meetingTitle}'.`,
          };
        }
        return undefined;
      });

      if (
        errorDetails.length > 0 &&
        errorDetails.some((e) => e !== undefined)
      ) {
        throw new BadRequestException({
          message: 'Um ou mais usuários estão vinculados a uma reunião.',
          details: errorDetails,
        });
      }
    }
  }

  findAll() {
    return `This action returns all meetings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    console.log(updateMeetingDto);
    return `This action updates a #${id} meeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
