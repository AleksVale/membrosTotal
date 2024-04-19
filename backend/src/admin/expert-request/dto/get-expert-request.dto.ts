// expert.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class ExpertResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  instagram!: string;

  @ApiProperty({ required: false })
  youtube?: string;

  @ApiProperty()
  platforms!: string;

  @ApiProperty()
  hasProduct!: string;

  @ApiProperty()
  invoiced!: number;

  @ApiProperty({ required: false })
  productLink?: string;

  @ApiProperty()
  budget!: number;

  @ApiProperty()
  compromised!: string;

  @ApiProperty()
  searching!: string;

  @ApiProperty()
  diferential!: string;

  @ApiProperty()
  extraInfo!: string;

  @ApiProperty()
  whatsapp!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
