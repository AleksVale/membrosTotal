import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const updatePaymentRequestSchema = z
  .object({
    status: z.enum(['APPROVED', 'CANCELLED', 'PAID', 'PENDING'], {
      required_error: 'O status é obrigatório',
      invalid_type_error: 'Status inválido',
    }),
    reason: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      return !(data.status === 'CANCELLED' && !data.reason);
    },
    {
      message: 'O motivo é obrigatório quando o status é "rejected"',
      path: ['reason'],
    },
  );

// class is required for using DTO as a type
export class UpdatePaymentRequestAdminDTO extends createZodDto(
  updatePaymentRequestSchema,
) {}
