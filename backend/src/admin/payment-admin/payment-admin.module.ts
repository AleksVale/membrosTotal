import { Module } from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { PaymentAdminController } from './payment-admin.controller';
import { PaymentRepository } from './payment.repository';
import { UserModule } from 'src/admin/user/user.module';
import { AwsService } from 'src/common/aws/aws.service';

@Module({
  imports: [UserModule],
  controllers: [PaymentAdminController],
  providers: [PaymentAdminService, PaymentRepository, AwsService],
})
export class PaymentAdminModule {}
