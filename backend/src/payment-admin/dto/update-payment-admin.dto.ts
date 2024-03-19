import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const updatePaymentSchema = z.object({
  value: z
    .number({ required_error: 'O valor é obrigatório' })
    .min(3, { message: 'Valor deve ter no mínimo 3 caracteres' })
    .optional(),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' })
    .optional(),
  expertId: z
    .number({ required_error: 'O id do especialista é obrigatório' })
    .optional(),
  paymentTypeId: z.number().optional(),
  status: z.enum(['PAID', 'CANCELLED', 'PENDING']).optional(),
});

// class is required for using DTO as a type
export class UpdatePaymentAdminDto extends createZodDto(updatePaymentSchema) {}
