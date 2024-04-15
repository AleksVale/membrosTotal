import { ApiProperty } from '@nestjs/swagger';

export class LessonsCollaboratorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  submoduleId!: number;

  @ApiProperty()
  thumbnail!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
