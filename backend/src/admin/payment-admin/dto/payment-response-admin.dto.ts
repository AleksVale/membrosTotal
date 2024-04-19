import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDTO } from '../../../admin/user/dto/user-response.dto';

export class PaymentTypeDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;
}

export class PaymentResponseAdminDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;

  @ApiProperty({ type: PaymentTypeDTO })
  paymentType!: PaymentTypeDTO;

  @ApiProperty({ type: UserResponseDTO })
  user!: UserResponseDTO;

  @ApiProperty({ type: UserResponseDTO })
  expert!: UserResponseDTO;
}
