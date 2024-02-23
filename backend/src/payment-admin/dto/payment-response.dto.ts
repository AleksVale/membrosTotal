import { ApiProperty } from '@nestjs/swagger';

export class PaymentTypeDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;
}

export class UserDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}

export class PaymentResponseDTO {
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

  @ApiProperty({ type: UserDTO })
  user!: UserDTO;

  @ApiProperty({ type: UserDTO })
  expert!: UserDTO;
}
