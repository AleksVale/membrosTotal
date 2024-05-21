import { ApiProperty } from '@nestjs/swagger';

export class GetPictureResponse {
  @ApiProperty()
  picture!: string | null;
}
