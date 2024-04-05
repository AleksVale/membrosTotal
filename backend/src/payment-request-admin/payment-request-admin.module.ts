import { Module } from '@nestjs/common';
import { PaymentRequestAdminService } from './payment-request-admin.service';
import { PaymentRequestAdminController } from './payment-request-admin.controller';
import { PaymentRequestRequestAdminRepository } from './payment-request-admin.repository';

@Module({
  controllers: [PaymentRequestAdminController],
  providers: [PaymentRequestAdminService, PaymentRequestRequestAdminRepository],
})
export class PaymentRequestAdminModule {}
