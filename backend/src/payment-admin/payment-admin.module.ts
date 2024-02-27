import { Module } from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { PaymentAdminController } from './payment-admin.controller';
import { PaymentRepository } from './payment.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PaymentAdminController],
  providers: [PaymentAdminService, PaymentRepository],
})
export class PaymentAdminModule {}
