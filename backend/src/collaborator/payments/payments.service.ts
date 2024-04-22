import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { TokenPayload } from '../../public/auth/jwt.strategy';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/common/aws/aws.service';
import { PaymentRepository } from 'src/admin/payment-admin/payment.repository';
import { DeletePaymentDto } from './dto/delete-payment.dto';

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
}
