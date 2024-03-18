import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentAdminDTO } from './dto/create-payment-admin.dto';
import { UpdatePaymentAdminDto } from './dto/update-payment-admin.dto';
import { PaymentRepository } from './payment.repository';
import { Profile } from '../profile/profile.entity';
import { TokenPayload } from '../auth/jwt.strategy';
import { UserService } from '../user/user.service';
import { PaymentStatus } from '@prisma/client';

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

  update(id: number, updatePaymentAdminDto: UpdatePaymentAdminDto) {
    return this.paymentRepository.update(updatePaymentAdminDto, { id });
  }

  remove(id: number) {
    return `This action removes a #${id} paymentAdmin`;
  }
}
