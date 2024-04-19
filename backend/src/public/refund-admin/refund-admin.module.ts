import { Module } from '@nestjs/common';
import { RefundAdminService } from './refund-admin.service';
import { RefundAdminController } from './refund-admin.controller';
import { RefundsRepository } from 'src/collaborator/refund/refunds.repository';

@Module({
  controllers: [RefundAdminController],
  providers: [RefundAdminService, RefundsRepository],
})
export class RefundAdminModule {}
