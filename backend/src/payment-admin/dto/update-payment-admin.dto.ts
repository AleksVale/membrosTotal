import { PartialType } from '@nestjs/swagger';
import { CreatePaymentAdminDTO } from './create-payment-admin.dto';

export class UpdatePaymentAdminDto extends PartialType(CreatePaymentAdminDTO) {}
