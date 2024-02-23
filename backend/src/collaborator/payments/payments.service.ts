import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from '../../payment-admin/payment.repository';
import { TokenPayload } from '../../auth/jwt.strategy';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  create(createPaymentDto: CreatePaymentDto, user: TokenPayload) {
    return this.paymentRepository.create({
      ...createPaymentDto,
      userId: user.id,
    });
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
