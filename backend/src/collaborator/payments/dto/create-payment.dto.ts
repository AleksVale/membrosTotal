import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { DateUtils } from 'src/utils/date';

const createPaymentSchema = z.object({
  value: z
    .number({ required_error: 'O valor é obrigatório' })
    .min(0.01, { message: 'Valor deve ser maior que zero' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  paymentTypeId: z.number({
    required_error: 'O id do tipo de pagamento é obrigatório',
  }),
  paymentDate: z
    .dateString({ required_error: 'A data do pagamento é obrigatória' })
    .format('date')
    .transform((val) => DateUtils.stringToDate(val)),
});

// class is required for using DTO as a type
export class CreatePaymentDto extends createZodDto(createPaymentSchema) {}
