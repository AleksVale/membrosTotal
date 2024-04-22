import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const deletePaymentSchema = z.object({
  reason: z
    .string({ required_error: 'O motivo é obrigatório' })
    .min(3, { message: 'Motivo deve ter no mínimo 3 caracteres' }),
});

// class is required for using DTO as a type
export class DeletePaymentDto extends createZodDto(deletePaymentSchema) {}
