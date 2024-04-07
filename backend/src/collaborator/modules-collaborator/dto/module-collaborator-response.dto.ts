import { ApiProperty } from '@nestjs/swagger';

export class ModuleCollaboratorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  trainingId!: number;

  @ApiProperty()
  thumbnail!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
