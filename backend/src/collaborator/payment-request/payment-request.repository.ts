import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { CollaboratorPaymentRequestOptions } from './payment-request.service';
import { PaymentResponseDTO } from '../payments/dto/payment-response.dto';

@Injectable()
export class PaymentRequestRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PaymentRequestUncheckedCreateInput) {
    return await this.prisma.paymentRequest.create({ data });
  }

  async find(condition: Prisma.PaymentRequestWhereInput) {
    return await this.prisma.paymentRequest.findFirst({
      where: condition,
    });
  }

  async update(
    paymentRequest: Prisma.PaymentRequestUpdateInput,
    where: Prisma.PaymentRequestWhereUniqueInput,
  ) {
    return await this.prisma.paymentRequest.update({
      data: paymentRequest,
      where: where,
    });
  }

  async findAll(options: CollaboratorPaymentRequestOptions) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<PaymentResponseDTO, Prisma.PaymentRequestFindManyArgs>(
      this.prisma.paymentRequest,
      {
        where: {
          status: options.status,
          userId: options.user,
          paymentRequestTypeId: options.paymentRequestTypeId,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          PaymentRequestType: true,
          User: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
