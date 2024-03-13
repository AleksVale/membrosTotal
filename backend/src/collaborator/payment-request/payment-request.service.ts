import { Injectable } from '@nestjs/common';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';

@Injectable()
export class PaymentRequestService {
  create(createPaymentRequestDto: CreatePaymentRequestDto) {
    return 'This action adds a new paymentRequest';
  }

  findAll() {
    return `This action returns all paymentRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentRequest`;
  }

  update(id: number, updatePaymentRequestDto: UpdatePaymentRequestDto) {
    return `This action updates a #${id} paymentRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentRequest`;
  }
}
