import { ApiProperty } from '@nestjs/swagger';

export class SubmoduleCollaboratorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  moduleId!: number;

  @ApiProperty()
  thumbnail!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
