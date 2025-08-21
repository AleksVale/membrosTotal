import { ApiProperty } from '@nestjs/swagger';

export class PaymentOverviewDTO {
  @ApiProperty()
  totalEarnings!: number;

  @ApiProperty()
  pendingAmount!: number;

  @ApiProperty()
  paidAmount!: number;

  @ApiProperty()
  cancelledAmount!: number;

  @ApiProperty()
  totalPayments!: number;

  @ApiProperty()
  pendingPayments!: number;

  @ApiProperty()
  paidPayments!: number;

  @ApiProperty()
  cancelledPayments!: number;

  @ApiProperty()
  monthlyGrowth!: number;

  @ApiProperty()
  averagePaymentValue!: number;

  @ApiProperty()
  successRate!: number;
}

export class MonthlyDataDTO {
  @ApiProperty()
    month!: string;

  @ApiProperty()
  paid!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  cancelled!: number;

  @ApiProperty()
  total!: number;
}

export class CategoryDataDTO {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  color!: string;
}
