import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusMeeting } from '@prisma/client';
import { DateUtils } from 'src/utils/date';
import { CreateMeetingDTO } from './dto/create-meeting.dto';
import { UpdateMeetingDTO } from './dto/update-meeting.dto';
import { MeetingRepository } from './meeting.repository';

export interface IMeetingFilters {
  title?: string;
  status?: string;
  date?: string;
  user?: number;
  page: number;
  per_page: number;
}

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
        description: createMeetingDto.description,
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

  findAll({ date, status, user, page, per_page, title }: IMeetingFilters) {
    return this.meetingRepository.findAll({
      title,
      date,
      status,
      user,
      page,
      per_page,
    });
  }

  async findOne(id: number) {
    const meeting = await this.meetingRepository.findOneWithUsers({ id });
    if (!meeting) throw new NotFoundException('Reunião não encontrada');
    return meeting;
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDTO) {
    const meeting = await this.meetingRepository.find({ id });
    if (!meeting) throw new BadRequestException('Reunião não encontrada');
    if (updateMeetingDto.users) {
      await this.meetingRepository.deleteMeetingUsers(id);
    }

    const entity: Prisma.MeetingUpdateInput = {
      title: updateMeetingDto.title,
      link: updateMeetingDto.link,
      description: updateMeetingDto.description,
      date: updateMeetingDto.meetingDate
        ? DateUtils.stringToDate(updateMeetingDto.meetingDate)
        : undefined,
      status: updateMeetingDto.status
        ? StatusMeeting[updateMeetingDto.status]
        : undefined,
      UserMeeting: updateMeetingDto.users
        ? {
            createMany: {
              data: updateMeetingDto.users?.map((user) => ({ userId: user })),
            },
          }
        : undefined,
    };
    await this.meetingRepository.update(entity, { id });
  }

  async changeStatus(id: number, status: StatusMeeting) {
    const meeting = await this.meetingRepository.find({ id });
    if (!meeting) throw new BadRequestException('Reunião não encontrada');
    const newStatus = StatusMeeting[status];
    if (!newStatus) throw new BadRequestException('Status inválido');
    return await this.meetingRepository.update({ status: newStatus }, { id });
  }

  async remove(id: number) {
    const meeting = await this.meetingRepository.find({ id });
    if (!meeting) throw new NotFoundException('Reunião não encontrada');

    // Deletar os relacionamentos UserMeeting primeiro
    await this.meetingRepository.deleteMeetingUsers(id);

    // Deletar a reunião
    return await this.meetingRepository.delete({ id });
  }
}
