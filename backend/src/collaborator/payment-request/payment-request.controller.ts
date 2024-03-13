import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { CreatePaymentRequestCollaboratorDTO } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestCollaboratorDTO } from './dto/update-payment-request.dto';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentResponseDto } from 'src/payment-request-admin/dto/payment-request-response.dto';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { SuccessResponse } from 'src/utils/success-response.dto';

@ApiTags('Collaborator/PaymentRequest')
@Controller('payment-request')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}

  @Post()
  create(
    @Body() createPaymentRequestDto: CreatePaymentRequestCollaboratorDTO,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.paymentRequestService.create(createPaymentRequestDto, user);
  }

  @ApiOkResponse({
    description: 'This action returns all paymentRequest for the user',
    type: PaymentResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @ApiQuery({ name: 'paymentRequestTypeId', required: false, type: Number })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('paymentRequestTypeId') paymentRequestTypeId?: number,
  ) {
    return this.paymentRequestService.findAll({
      page,
      per_page,
      status,
      user: user.id,
      paymentRequestTypeId,
    });
  }

  @ApiResponse({ type: SuccessResponse, status: 200 })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentRequestDto: UpdatePaymentRequestCollaboratorDTO,
  ) {
    return this.paymentRequestService.update(+id, updatePaymentRequestDto);
  }
}
