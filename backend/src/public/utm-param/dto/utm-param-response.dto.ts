import { ApiProperty } from '@nestjs/swagger';

export class UtmParamResponse {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  utmSource!: string;
  @ApiProperty()
  utmMedium!: string;
  @ApiProperty()
  utmCampaign!: string;
  @ApiProperty()
  utmTerm!: string;
  @ApiProperty()
  utmContent!: string;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;
}
