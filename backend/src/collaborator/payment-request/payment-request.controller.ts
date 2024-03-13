import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { CreatePaymentRequestAdminDTO } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';

@Controller('payment-request')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}

  @Post()
  create(@Body() createPaymentRequestDto: CreatePaymentRequestAdminDTO) {
    return this.paymentRequestService.create(createPaymentRequestDto);
  }

  @Get()
  findAll() {
    return this.paymentRequestService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentRequestDto: UpdatePaymentRequestDto,
  ) {
    return this.paymentRequestService.update(+id, updatePaymentRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentRequestService.remove(+id);
  }
}
