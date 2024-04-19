import { Injectable } from '@nestjs/common';
import { CreatePaymentRequestCollaboratorDTO } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestCollaboratorDTO } from './dto/update-payment-request.dto';
import { PaymentRequestRequestRepository } from './payment-request.repository';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/common/aws/aws.service';

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
    private readonly awsService: AwsService,
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

  remove(id: number) {
    return this.paymentRequestRepository.update(
      {
        status: PaymentStatus.CANCELLED,
        reason: 'Solicitação cancelada pelo usuário',
      },
      { id },
    );
  }

  async createFile(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentRequestId: number,
  ) {
    const payment = await this.paymentRequestRepository.find({
      id: paymentRequestId,
    });
    const photoKey = payment?.photoKey
      ? payment.photoKey
      : this.awsService.createPhotoKeyPaymentRequest(
          user.id,
          paymentRequestId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, photoKey);
    return this.paymentRequestRepository.update(
      { photoKey },
      { id: paymentRequestId },
    );
  }
}
