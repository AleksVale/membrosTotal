import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDTO } from 'src/admin/user/dto/user-response.dto';

class RefundTypeDto {
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
  refundDate!: Date;

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
  User!: UserResponseDTO;

  @ApiProperty({ type: () => RefundTypeDto })
  RefundTypeDto!: RefundTypeDto;
}
