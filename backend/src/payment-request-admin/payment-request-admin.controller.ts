import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PaymentRequestAdminService } from './payment-request-admin.service';
import { UpdatePaymentRequestAdminDTO } from './dto/update-payment-request-admin.dto';
import { PaymentStatus } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';

@Controller('payment-request-admin')
export class PaymentRequestAdminController {
  constructor(
    private readonly paymentRequestAdminService: PaymentRequestAdminService,
  ) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @ApiQuery({ name: 'user', required: false, type: Number })
  @ApiQuery({ name: 'paymentRequestTypeId', required: false, type: Number })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('user') user?: number,
    @Query('paymentRequestTypeId') paymentRequestTypeId?: number,
  ) {
    return this.paymentRequestAdminService.findAll({
      page,
      per_page,
      paymentRequestTypeId,
      status,
      user,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentRequestAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentRequestAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.paymentRequestAdminService.update(
      +id,
      updatePaymentRequestAdminDto,
    );
  }
}
