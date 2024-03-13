import { Module } from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { PaymentRequestController } from './payment-request.controller';
import { PaymentRequestRequestRepository } from './payment-request.repository';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [PaymentRequestController],
  providers: [
    PaymentRequestService,
    PaymentRequestRequestRepository,
    AwsService,
  ],
})
export class PaymentRequestModule {}
