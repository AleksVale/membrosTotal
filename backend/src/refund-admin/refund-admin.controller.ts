import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RefundAdminService } from './refund-admin.service';
import { UpdatePaymentRequestAdminDTO } from 'src/payment-request-admin/dto/update-payment-request-admin.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { PaymentResponseDto } from 'src/payment-request-admin/dto/payment-request-response.dto';
import { PaymentStatus } from '@prisma/client';

@ApiTags('Refunds')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@Controller('refund-admin')
export class RefundAdminController {
  constructor(private readonly refundAdminService: RefundAdminService) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @ApiQuery({ name: 'user', required: false, type: Number })
  @ApiQuery({ name: 'refundTypeId', required: false, type: Number })
  @ApiOkResponse({
    description: 'This action returns all refunds',
    type: PaymentResponseDto,
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('user') user?: number,
    @Query('refundTypeId') refundTypeId?: number,
  ) {
    return this.refundAdminService.findAll({
      page,
      per_page,
      status,
      user: user ? +user : undefined,
      refundTypeId: refundTypeId ? +refundTypeId : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefundAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.refundAdminService.update(+id, updateRefundAdminDto);
  }
}
