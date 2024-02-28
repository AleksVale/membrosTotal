import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from '../../payment-admin/payment.repository';
import { TokenPayload } from '../../auth/jwt.strategy';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/aws/aws.service';

export interface IFindAllPayment {
  page: number;
  per_page: number;
  user?: number;
  status?: PaymentStatus;
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
  }: {
    page: number;
    per_page: number;
    userId: number;
    status: string;
  }) {
    const statusEnum = Payment[status];
    if (status && !statusEnum) {
      throw new BadRequestException('Status inválido');
    }
    return this.paymentRepository.findAll({
      page,
      per_page,
      user: userId,
      status: statusEnum,
    });
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

  async createFile(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentId: number,
  ) {
    const photoKey = `payments/${user.id}/${paymentId}/${file.originalname}`;
    await this.awsService.updatePhoto(file, photoKey);
    return this.paymentRepository.update({ photoKey }, { id: paymentId });
  }
}
