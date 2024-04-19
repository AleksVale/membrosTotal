import { ApiProperty } from '@nestjs/swagger';
import { MeetingResponseDTO } from 'src/admin/meetings/dto/meeting-response.dto';

export class HomeResponseDto {
  @ApiProperty({ type: [MeetingResponseDTO] })
  meetings!: MeetingResponseDTO[];
}
