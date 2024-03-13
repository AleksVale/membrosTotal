import { Module } from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { PaymentRequestController } from './payment-request.controller';
import { PaymentRequestRequestRepository } from './payment-request.repository';

@Module({
  controllers: [PaymentRequestController],
  providers: [PaymentRequestService, PaymentRequestRequestRepository],
})
export class PaymentRequestModule {}
