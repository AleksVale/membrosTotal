import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { CollaboratorRefundsOptions } from './refunds.service';
import { PaymentResponseDTO } from '../payments/dto/payment-response.dto';

@Injectable()
export class RefundsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RefundUncheckedCreateInput) {
    return await this.prisma.refund.create({ data });
  }

  async find(condition: Prisma.RefundWhereInput) {
    return await this.prisma.refund.findFirst({
      where: condition,
    });
  }

  async update(
    refund: Prisma.RefundUpdateInput,
    where: Prisma.RefundWhereUniqueInput,
  ) {
    return await this.prisma.refund.update({
      data: refund,
      where: where,
    });
  }

  async findAll(options: CollaboratorRefundsOptions) {
    const prismaExtended = this.prisma.$extends({
      name: 'refundFullname',
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

    return paginate<PaymentResponseDTO, Prisma.RefundFindManyArgs>(
      prismaExtended.refund,
      {
        where: {
          status: options.status,
          userId: options.user,
          refundTypeId: options.refundTypeId,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          RefundType: true,
          User: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
