import { Module } from '@nestjs/common';
import { RefundAdminService } from './refund-admin.service';
import { RefundAdminController } from './refund-admin.controller';
import { RefundsRepository } from 'src/collaborator/refund/refunds.repository';
import { AwsService } from 'src/common/aws/aws.service';

@Module({
  controllers: [RefundAdminController],
  providers: [RefundAdminService, RefundsRepository, AwsService],
})
export class RefundAdminModule {}
