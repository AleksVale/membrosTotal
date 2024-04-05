import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './success-response.dto';

export class PostResponse extends SuccessResponse {
  @ApiProperty()
  id!: number;
}
