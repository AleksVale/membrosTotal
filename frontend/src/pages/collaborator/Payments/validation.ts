import { z } from 'zod'

export const createPaymentchema = z.object({
  value: z.coerce.number().positive({ message: 'Valor obrigatório' }),
  description: z
    .string()
    .min(3, { message: 'Descrição obrigatória' })
    .max(191, { message: 'Descrição muito longa, use até 191 caracteres' }),
  // paymentTypeId: z.number({ required_error: 'Tipo de pagamento obrigatório' }),
})

export type CreatePaymentDTO = z.infer<typeof createPaymentchema>

export const filterPaymentchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'APPROVED', 'ALL']),
})

export type FilterPayment = z.infer<typeof filterPaymentchema>
