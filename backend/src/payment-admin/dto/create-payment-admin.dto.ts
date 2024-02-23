import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createPaymentSchema = z.object({
  value: z
    .number({ required_error: 'O valor é obrigatório' })
    .min(3, { message: 'Valor deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  expertId: z.number({ required_error: 'O id do especialista é obrigatório' }),
  paymentTypeId: z.number({
    required_error: 'O id do tipo de pagamento é obrigatório',
  }),
});

// class is required for using DTO as a type
export class CreatePaymentAdminDTO extends createZodDto(createPaymentSchema) {}
