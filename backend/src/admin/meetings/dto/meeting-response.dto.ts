import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDTO } from '../../../user/dto/user-response.dto';

export class UserMeetingDTO {
  @ApiProperty()
  userId!: number;

  @ApiProperty()
  meetingId!: number;

  @ApiProperty({ type: () => UserResponseDTO })
  User!: UserResponseDTO;
}

export class MeetingResponseDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  date!: Date;

  @ApiProperty()
  link!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => [UserMeetingDTO] })
  UserMeeting!: UserMeetingDTO[];
}
