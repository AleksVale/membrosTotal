import { Module } from '@nestjs/common';
import { AwsModule } from 'src/common/aws/aws.module';
import { PaymentRepository } from '../../admin/payment-admin/payment.repository';
import { PaymentStatsController } from './payment-stats.controller';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AwsModule],
  controllers: [PaymentsController, PaymentStatsController],
  providers: [PaymentsService, PaymentRepository],
})
export class PaymentsModule {}
