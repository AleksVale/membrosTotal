import { ApiProperty } from '@nestjs/swagger';
import { MeetingResponseDTO } from 'src/admin/meetings/dto/meeting-response.dto';

export class NotificationResponseDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  read!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class HomeResponseDto {
  @ApiProperty({ type: [MeetingResponseDTO] })
  meetings!: MeetingResponseDTO[];

  @ApiProperty({ type: [NotificationResponseDTO] })
  notifications!: NotificationResponseDTO[];
}
