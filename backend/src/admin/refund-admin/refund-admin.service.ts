import { BadRequestException, Injectable } from '@nestjs/common';
import { RefundsRepository } from 'src/collaborator/refund/refunds.repository';
import { CollaboratorRefundsOptions } from 'src/collaborator/refund/refunds.service';
import { UpdatePaymentRequestAdminDTO } from 'src/admin/payment-request-admin/dto/update-payment-request-admin.dto';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class RefundAdminService {
  constructor(
    private readonly refundsRepository: RefundsRepository,
    private readonly awsService: AwsService,
  ) {}

  findAll(options: CollaboratorRefundsOptions) {
    return this.refundsRepository.findAll(options);
  }

  findOne(id: number) {
    return this.refundsRepository.find({ id });
  }

  update(id: number, updateRefundAdminDto: UpdatePaymentRequestAdminDTO) {
    return this.refundsRepository.update(updateRefundAdminDto, { id });
  }

  async getSignedURL(id: number) {
    const payment = await this.refundsRepository.find({ id });
    if (!payment) throw new BadRequestException('Reembolso não encontrado');
    const signedUrl = await this.awsService.getStoredObject(
      payment.photoKey as string,
    );
    return { signedUrl };
  }

  async createFileFinish(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentId: number,
  ) {
    const payment = await this.refundsRepository.find({ id: paymentId });
    const photoKey = payment?.approvedPhotoKey
      ? payment.photoKey
      : this.awsService.createPhotoKeyRefunds(
          user.id,
          paymentId,
          file.mimetype.split('/')[1],
          'finish',
        );
    if (photoKey) {
      await this.awsService.updatePhoto(file, photoKey);
    }
    return this.refundsRepository.update(
      { approvedPhotoKey: photoKey },
      { id: paymentId },
    );
  }
}
