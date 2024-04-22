import { RefundTypeDto, PaymentStatus } from '@/utils/interfaces/payment'
import { User } from '../User/interfaces'

export interface IRefund {
  id: number
  userId: number
  value?: number | null
  requestDate?: Date | null
  photoKey?: string | null
  status: PaymentStatus
  reason?: string | null
  approvedPhotoKey: string | null
  paidBy?: number | null
  description: string
  createdAt: Date
  updatedAt: Date
  User: User
  RefundType?: RefundTypeDto | null
  refundTypeId?: number | null
}
