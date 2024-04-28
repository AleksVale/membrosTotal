import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePaymentRequestAdminDTO } from './dto/update-payment-request-admin.dto';
import { PaymentRequestRequestAdminRepository } from './payment-request-admin.repository';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
export interface PaymentRequestOptions {
  per_page: number;
  status?: PaymentStatus;
  user?: number;
  paymentRequestTypeId?: number; // Optional parameter
  page: number;
}

@Injectable()
export class PaymentRequestAdminService {
  constructor(
    private readonly paymentRequestRepository: PaymentRequestRequestAdminRepository,
    private readonly awsService: AwsService,
  ) {}
  findAll({
    page,
    per_page,
    paymentRequestTypeId,
    status,
    user,
  }: PaymentRequestOptions) {
    return this.paymentRequestRepository.findAll({
      page,
      per_page,
      paymentRequestTypeId,
      status,
      user,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentRequestAdmin`;
  }

  update(
    id: number,
    updatePaymentRequestAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.paymentRequestRepository.update(updatePaymentRequestAdminDto, {
      id: id,
    });
  }

  async createFileFinish(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentId: number,
  ) {
    const payment = await this.paymentRequestRepository.find({ id: paymentId });
    const photoKey = payment?.approvedPhotoKey
      ? payment.photoKey
      : this.awsService.createPhotoKeyPaymentRequest(
          user.id,
          paymentId,
          file.mimetype.split('/')[1],
          'finish',
        );
    if (photoKey) {
      await this.awsService.updatePhoto(file, photoKey);
    }
    return this.paymentRequestRepository.update(
      { approvedPhotoKey: photoKey },
      { id: paymentId },
    );
  }

  async getSignedURL(id: number) {
    const payment = await this.paymentRequestRepository.find({ id });
    if (!payment)
      throw new BadRequestException('Solicitação de pagamento não encontrada');
    const signedUrl = await this.awsService.getStoredObject(
      payment.photoKey as string,
    );
    return { signedUrl };
  }
}
