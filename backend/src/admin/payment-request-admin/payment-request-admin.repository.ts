import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PaymentResponseDto } from './dto/payment-request-response.dto';
import { PaymentRequestOptions } from './payment-request-admin.service';

@Injectable()
export class PaymentRequestRequestAdminRepository {
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

  async findAll(options: PaymentRequestOptions) {
    const prismaExtended = this.prisma.$extends({
      name: 'paymentRequestFullname',
      result: {
        user: {
          fullName: {
            needs: { firstName: true, lastName: true },
            compute(user) {
              return `${user.firstName} ${user.lastName}`;
            },
          },
        },
      },
    });
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<PaymentResponseDto, Prisma.PaymentRequestFindManyArgs>(
      prismaExtended.paymentRequest,
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
