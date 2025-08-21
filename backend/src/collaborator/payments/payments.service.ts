import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PaymentRepository } from 'src/admin/payment-admin/payment.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from '../../public/auth/jwt.strategy';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DeletePaymentDto } from './dto/delete-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

export interface IFindAllPayment {
  page: number;
  per_page: number;
  user?: number;
  status?: PaymentStatus;
  search?: string;
  paymentTypeId?: number;
}
@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly awsService: AwsService,
  ) {}
  create(createPaymentDto: CreatePaymentDto, user: TokenPayload) {
    return this.paymentRepository.create({
      ...createPaymentDto,
      userId: user.id,
    });
  }

  findAll({
    page,
    per_page,
    userId,
    status,
    search,
    paymentTypeId,
  }: {
    page: number;
    per_page: number;
    userId: number;
    status?: string;
    search?: string;
    paymentTypeId?: number;
  }) {
    let statusEnum: PaymentStatus | undefined;
    
    if (status && status !== 'ALL') {
      if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
        statusEnum = status as PaymentStatus;
      } else {
        throw new BadRequestException('Status inválido');
      }
    }
    
    return this.paymentRepository.findAll({
      page,
      per_page,
      user: userId,
      status: statusEnum,
      search,
      paymentTypeId,
    });
  }

  findOne(id: number) {
    return this.paymentRepository.find({ id });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.update(updatePaymentDto, { id });
  }

  remove(id: number, data: DeletePaymentDto) {
    return this.paymentRepository.update(
      { status: PaymentStatus.CANCELLED, reason: data.reason },
      { id },
    );
  }

  async createFile(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentId: number,
  ) {
    const payment = await this.paymentRepository.find({ id: paymentId });
    const photoKey = payment?.photoKey
      ? payment.photoKey
      : this.awsService.createPhotoKeyPayment(
          user.id,
          paymentId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, photoKey);
    return this.paymentRepository.update({ photoKey }, { id: paymentId });
  }

  async getSignedUrl(photoKey: string) {
    return this.awsService.getStoredObject(photoKey);
  }

  async getOverviewStats(userId: number) {
    const allPayments = await this.paymentRepository.findAllRaw({ userId });
    
    const totalEarnings = allPayments.reduce((sum, payment) => {
      if (payment.status === 'PAID') {
        return sum + payment.value;
      }
      return sum;
    }, 0);

    const pendingAmount = allPayments.reduce((sum, payment) => {
      if (payment.status === 'PENDING') {
        return sum + payment.value;
      }
      return sum;
    }, 0);

    const paidAmount = allPayments.reduce((sum, payment) => {
      if (payment.status === 'PAID') {
        return sum + payment.value;
      }
      return sum;
    }, 0);

    const cancelledAmount = allPayments.reduce((sum, payment) => {
      if (payment.status === 'CANCELLED') {
        return sum + payment.value;
      }
      return sum;
    }, 0);

    const totalPayments = allPayments.length;
    const pendingPayments = allPayments.filter(p => p.status === 'PENDING').length;
    const paidPayments = allPayments.filter(p => p.status === 'PAID').length;
    const cancelledPayments = allPayments.filter(p => p.status === 'CANCELLED').length;

    // Calcular crescimento mensal (comparar com mês anterior)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthPayments = allPayments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previousMonthPayments = allPayments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate.getMonth() === previousMonth && paymentDate.getFullYear() === previousYear;
    });

    const currentMonthTotal = currentMonthPayments.reduce((sum, p) => sum + p.value, 0);
    const previousMonthTotal = previousMonthPayments.reduce((sum, p) => sum + p.value, 0);

    const monthlyGrowth = previousMonthTotal > 0 
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
      : 0;

    const averagePaymentValue = totalPayments > 0 ? totalEarnings / totalPayments : 0;
    const successRate = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;

    return {
      totalEarnings,
      pendingAmount,
      paidAmount,
      cancelledAmount,
      totalPayments,
      pendingPayments,
      paidPayments,
      cancelledPayments,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      averagePaymentValue: Math.round(averagePaymentValue * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  async getMonthlyStats(userId: number, months: number = 6) {
    const allPayments = await this.paymentRepository.findAllRaw({ userId });
    const monthlyData: Array<{
      month: string;
      paid: number;
      pending: number;
      cancelled: number;
      total: number;
    }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthPayments = allPayments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
      });

      const paid = monthPayments
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + p.value, 0);

      const pending = monthPayments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.value, 0);

      const cancelled = monthPayments
        .filter(p => p.status === 'CANCELLED')
        .reduce((sum, p) => sum + p.value, 0);

      monthlyData.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        paid: Math.round(paid * 100) / 100,
        pending: Math.round(pending * 100) / 100,
        cancelled: Math.round(cancelled * 100) / 100,
        total: Math.round((paid + pending + cancelled) * 100) / 100,
      });
    }

    return monthlyData;
  }

  async getCategoryStats(userId: number) {
    const allPayments = await this.paymentRepository.findAllRaw({ userId });
    const categoryMap = new Map();

    // Cores para as categorias
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

    allPayments.forEach((payment, index) => {
      if (payment.PaymentType) {
        const categoryName = payment.PaymentType.label;
        const existing = categoryMap.get(categoryName);

        if (existing) {
          existing.value += 1;
          existing.amount += payment.value;
        } else {
          categoryMap.set(categoryName, {
            name: categoryName,
            value: 1,
            amount: payment.value,
            color: colors[index % colors.length],
          });
        }
      }
    });

    const categoryData = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      amount: Math.round(cat.amount * 100) / 100,
    }));

    return categoryData;
  }
}
