import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponse {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  createdAt!: Date;
}
