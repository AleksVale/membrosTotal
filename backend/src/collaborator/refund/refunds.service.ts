import { Injectable } from '@nestjs/common';
import { CreateRefundCollaboratorDTO } from './dto/create-refund.dto';
import { UpdateRefundCollaboratorDTO } from './dto/update-refund.dto';
import { RefundsRepository } from './refunds.repository';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/aws/aws.service';

export interface CollaboratorRefundsOptions {
  per_page: number;
  status?: PaymentStatus;
  user: number;
  page: number;
}

@Injectable()
export class RefundsService {
  constructor(
    private readonly refundRepository: RefundsRepository,
    private readonly awsService: AwsService,
  ) {}
  create(createRefundsDto: CreateRefundCollaboratorDTO, user: TokenPayload) {
    const paymentRequest = { ...createRefundsDto, userId: user.id };
    return this.refundRepository.create(paymentRequest);
  }

  findAll({ page, per_page, status, user }: CollaboratorRefundsOptions) {
    return this.refundRepository.findAll({
      page,
      per_page,
      status,
      user,
    });
  }

  findOne(id: number) {
    return this.refundRepository.find({ id });
  }

  update(id: number, updateRefundsDto: UpdateRefundCollaboratorDTO) {
    return this.refundRepository.update(updateRefundsDto, {
      id,
    });
  }

  async createFile(
    file: Express.Multer.File,
    user: TokenPayload,
    paymentRequestId: number,
  ) {
    const payment = await this.refundRepository.find({
      id: paymentRequestId,
    });
    const photoKey = payment?.photoKey
      ? payment.photoKey
      : this.awsService.createPhotoKeyRefunds(
          user.id,
          paymentRequestId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, photoKey);
    return this.refundRepository.update({ photoKey }, { id: paymentRequestId });
  }
}
