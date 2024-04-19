import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentAdminDTO } from './dto/create-payment-admin.dto';
import { UpdatePaymentAdminDto } from './dto/update-payment-admin.dto';
import { PaymentRepository } from './payment.repository';
import { Profile } from '../../profile/profile.entity';
import { TokenPayload } from '../../public/auth/jwt.strategy';
import { UserService } from '../../user/user.service';
import { PaymentStatus } from '@prisma/client';
import { AwsService } from 'src/common/aws/aws.service';

export interface IFindAllPaymentAdmin {
  page: number;
  per_page: number;
  expert?: number;
  status?: PaymentStatus;
}
@Injectable()
export class PaymentAdminService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly userService: UserService,
    private readonly awsService: AwsService,
  ) {}
  async create(
    createPaymentAdminDto: CreatePaymentAdminDTO,
    user: TokenPayload,
  ) {
    const expert = await this.userService.findOne(
      createPaymentAdminDto.expertId,
    );
    if (!expert || expert.Profile.name !== Profile.EXPERT) {
      throw new BadRequestException('Usuário inválido');
    }
    return this.paymentRepository.create({
      description: createPaymentAdminDto.description,
      userId: user.id,
      value: createPaymentAdminDto.value,
      paymentTypeId: createPaymentAdminDto.paymentTypeId,
      PaymentExpert: {
        create: {
          userId: createPaymentAdminDto.expertId,
        },
      },
    });
  }

  findAll({ page, per_page, status }: IFindAllPaymentAdmin) {
    if (status && !PaymentStatus[status]) {
      throw new BadRequestException('Status inválido');
    }
    return this.paymentRepository.findAll({
      page,
      per_page,
      status,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentAdmin`;
  }

  async getSignedURL(id: number) {
    const payment = await this.paymentRepository.find({ id });
    if (!payment) throw new BadRequestException('Pagamento não encontrado');
    const signedUrl = await this.awsService.getStoredObject(
      payment.photoKey as string,
    );
    return { signedUrl };
  }

  update(id: number, updatePaymentAdminDto: UpdatePaymentAdminDto) {
    return this.paymentRepository.update(updatePaymentAdminDto, { id });
  }

  pay(id: number, user: TokenPayload) {
    return this.paymentRepository.update(
      { paidBy: user.id, status: PaymentStatus.PAID },
      { id },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} paymentAdmin`;
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
