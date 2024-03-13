import { Injectable } from '@nestjs/common';
import { CreatePaymentRequestCollaboratorDTO } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestCollaboratorDTO } from './dto/update-payment-request.dto';
import { PaymentRequestRequestRepository } from './payment-request.repository';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';

export interface CollaboratorPaymentRequestOptions {
  per_page: number;
  status?: PaymentStatus;
  user: number;
  paymentRequestTypeId?: number;
  page: number;
}

@Injectable()
export class PaymentRequestService {
  constructor(
    private readonly paymentRequestRepository: PaymentRequestRequestRepository,
  ) {}
  create(
    createPaymentRequestDto: CreatePaymentRequestCollaboratorDTO,
    user: TokenPayload,
  ) {
    const paymentRequest = { ...createPaymentRequestDto, userId: user.id };
    return this.paymentRequestRepository.create(paymentRequest);
  }

  findAll({
    page,
    paymentRequestTypeId,
    per_page,
    status,
    user,
  }: CollaboratorPaymentRequestOptions) {
    return this.paymentRequestRepository.findAll({
      page,
      paymentRequestTypeId,
      per_page,
      status,
      user,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentRequest`;
  }

  update(
    id: number,
    updatePaymentRequestDto: UpdatePaymentRequestCollaboratorDTO,
  ) {
    return this.paymentRequestRepository.update(updatePaymentRequestDto, {
      id,
    });
  }
}
