import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentRepository } from '../../admin/payment-admin/payment.repository';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
})
export class PaymentsModule {}
