import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';

export class CreateRefundResponseDTO extends SuccessResponse {
  @ApiProperty()
  id!: number;
}
