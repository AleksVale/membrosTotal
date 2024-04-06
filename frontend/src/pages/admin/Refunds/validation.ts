import { z } from 'zod'

export const filterRefundchema = z.object({
  refundTypeId: z.string(),
})

export type FilterRefund = z.infer<typeof filterRefundchema>
