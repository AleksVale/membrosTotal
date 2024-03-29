import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { DateUtils } from 'src/utils/date';

const createPaymentRequestSchema = z.object({
  value: z
    .number({ required_error: 'O valor é obrigatório' })
    .min(3, { message: 'Valor deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  paymentRequestTypeId: z.number({
    required_error: 'O id do tipo de solicitação de pagamento é obrigatório',
  }),
  requestDate: z
    .dateString({ required_error: 'A data do evento é obrigatória' })
    .format('date')
    .transform((val) => DateUtils.stringToDate(val)),
});

// class is required for using DTO as a type
export class CreatePaymentRequestCollaboratorDTO extends createZodDto(
  createPaymentRequestSchema,
) {}
