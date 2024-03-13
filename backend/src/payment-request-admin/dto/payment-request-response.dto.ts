import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDTO } from 'src/user/dto/user-response.dto';

class PaymentRequestTypeDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  label!: string;
}

export class PaymentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  requestDate!: Date;

  @ApiProperty()
  photoKey!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  reason!: string;

  @ApiProperty()
  paidBy!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => UserResponseDTO })
  user!: UserResponseDTO;

  @ApiProperty({ type: () => PaymentRequestTypeDto })
  paymentRequestType!: PaymentRequestTypeDto;
}
