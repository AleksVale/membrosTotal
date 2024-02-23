import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { IFindAllPaymentAdmin } from './payment-admin.service';
import { PaymentResponseAdminDTO } from './dto/payment-response-admin.dto';
import { IFindAllPayment } from '../collaborator/payments/payments.service';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PaymentUncheckedCreateInput) {
    return await this.prisma.payment.create({ data });
  }

  async find(condition: Prisma.PaymentWhereInput) {
    return await this.prisma.payment.findFirst({
      where: condition,
    });
  }

  async update(
    payment: Prisma.PaymentUpdateInput,
    where: Prisma.PaymentWhereUniqueInput,
  ) {
    return await this.prisma.payment.update({
      data: payment,
      where: where,
    });
  }

  async findAllExpert(options: IFindAllPaymentAdmin) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<PaymentResponseAdminDTO, Prisma.PaymentFindManyArgs>(
      this.prisma.payment,
      {
        where: {
          status: options.status,
          PaymentExpert: {
            some: {
              userId: options.expert,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          PaymentExpert: {
            include: {
              User: true,
            },
          },
          PaymentType: true,
          User: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async findAll(options: IFindAllPayment) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<PaymentResponseAdminDTO, Prisma.PaymentFindManyArgs>(
      this.prisma.payment,
      {
        where: {
          status: options.status,
          userId: options.user,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          PaymentType: true,
          User: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
