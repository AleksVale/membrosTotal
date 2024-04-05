import { ApiProperty } from '@nestjs/swagger';

export class ProfileDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  label!: string;
}
