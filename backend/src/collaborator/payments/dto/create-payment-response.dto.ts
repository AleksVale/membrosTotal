import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';

export class CreatePaymentResponseDTO extends SuccessResponse {
  @ApiProperty()
  id!: number;
}
