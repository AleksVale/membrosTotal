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

export class PaymentRequestStatsDto {
  @ApiProperty()
  pending!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  approved!: number;

  @ApiProperty()
  rejectedPercentage!: number;
}

export class TrainingStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  inProgress!: number;

  @ApiProperty()
  completionRate!: number;
}

export class MeetingStatsDto {
  @ApiProperty()
  upcoming!: number;

  @ApiProperty()
  thisMonth!: number;

  @ApiProperty()
  total!: number;
}

export class ModuleStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  completionRate!: number;
}

export class LessonStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  completionRate!: number;
}

export class FinancialStatsDto {
  @ApiProperty()
  totalEarnings!: number;

  @ApiProperty()
  pendingAmount!: number;
}

export class NotificationStatsDto {
  @ApiProperty()
  unread!: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({ type: PaymentRequestStatsDto })
  paymentRequests!: PaymentRequestStatsDto;

  @ApiProperty({ type: TrainingStatsDto })
  trainings!: TrainingStatsDto;

  @ApiProperty({ type: MeetingStatsDto })
  meetings!: MeetingStatsDto;

  @ApiProperty({ type: ModuleStatsDto })
  modules!: ModuleStatsDto;

  @ApiProperty({ type: LessonStatsDto })
  lessons!: LessonStatsDto;

  @ApiProperty({ type: FinancialStatsDto })
  financials!: FinancialStatsDto;

  @ApiProperty({ type: NotificationStatsDto })
  notifications!: NotificationStatsDto;
}
