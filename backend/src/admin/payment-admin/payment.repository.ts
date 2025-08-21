import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFindAllPayment } from '../../collaborator/payments/payments.service';
import { PaymentResponseAdminDTO } from './dto/payment-response-admin.dto';
import { IFindAllPaymentAdmin } from './payment-admin.service';

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
        orderBy: { status: 'asc', createdAt: 'asc' },
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
    const prismaExtended = this.prisma.$extends({
      name: 'name',
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

    const where: Prisma.PaymentWhereInput = {
      status: options.status,
      userId: options.user,
    };

    // Adicionar busca por texto se fornecida
    if (options.search) {
      where.OR = [
        {
          description: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          reason: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Adicionar filtro por tipo de pagamento se fornecido
    if (options.paymentTypeId && !isNaN(options.paymentTypeId)) {
      where.paymentTypeId = options.paymentTypeId;
    }

    return paginate<PaymentResponseAdminDTO, Prisma.PaymentFindManyArgs>(
      prismaExtended.payment,
      {
        where,
        orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
        include: {
          PaymentType: {
            select: {
              id: true,
              label: true,
            },
          },
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      {
        page: options.page,
      },
    );
  }

  async findAllRaw(options: { userId: number }) {
    return this.prisma.payment.findMany({
      where: {
        userId: options.userId,
      },
      include: {
        PaymentType: {
          select: {
            id: true,
            label: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
