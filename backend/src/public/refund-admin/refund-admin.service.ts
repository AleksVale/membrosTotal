import { Injectable } from '@nestjs/common';
import { RefundsRepository } from 'src/collaborator/refund/refunds.repository';
import { CollaboratorRefundsOptions } from 'src/collaborator/refund/refunds.service';
import { UpdatePaymentRequestAdminDTO } from 'src/admin/payment-request-admin/dto/update-payment-request-admin.dto';

@Injectable()
export class RefundAdminService {
  constructor(private readonly refundsRepository: RefundsRepository) {}

  findAll(options: CollaboratorRefundsOptions) {
    return this.refundsRepository.findAll(options);
  }

  findOne(id: number) {
    return this.refundsRepository.find({ id });
  }

  update(id: number, updateRefundAdminDto: UpdatePaymentRequestAdminDTO) {
    return this.refundsRepository.update(updateRefundAdminDto, { id });
  }
}
