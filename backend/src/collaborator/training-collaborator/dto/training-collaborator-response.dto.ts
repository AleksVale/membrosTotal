import { ApiProperty } from '@nestjs/swagger';

export class TrainingCollaboratorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  tutor!: number;

  @ApiProperty()
  thumbnail!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
