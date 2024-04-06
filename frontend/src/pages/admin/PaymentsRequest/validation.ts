import { z } from 'zod'

export const filterPaymentRequestchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'APPROVED', 'ALL']),
})

export type FilterPaymentRequest = z.infer<typeof filterPaymentRequestchema>
