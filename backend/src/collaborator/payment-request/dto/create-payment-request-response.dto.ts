import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';

export class CreatePaymentRequestResponseDTO extends SuccessResponse {
  @ApiProperty()
  id!: number;
}
