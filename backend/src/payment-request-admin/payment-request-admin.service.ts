import { Injectable } from '@nestjs/common';
import { UpdatePaymentRequestAdminDTO } from './dto/update-payment-request-admin.dto';
import { PaymentRequestRequestAdminRepository } from './payment-request-admin.repository';
import { PaymentStatus } from '@prisma/client';
export interface PaymentRequestOptions {
  per_page: number;
  status?: PaymentStatus;
  user?: number;
  paymentRequestTypeId?: number; // Optional parameter
  page: number;
}

@Injectable()
export class PaymentRequestAdminService {
  constructor(
    private readonly paymentRequestRepository: PaymentRequestRequestAdminRepository,
  ) {}
  findAll({
    page,
    per_page,
    paymentRequestTypeId,
    status,
    user,
  }: PaymentRequestOptions) {
    return this.paymentRequestRepository.findAll({
      page,
      per_page,
      paymentRequestTypeId,
      status,
      user,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentRequestAdmin`;
  }

  update(
    id: number,
    updatePaymentRequestAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.paymentRequestRepository.update(updatePaymentRequestAdminDto, {
      id: id,
    });
  }
}
