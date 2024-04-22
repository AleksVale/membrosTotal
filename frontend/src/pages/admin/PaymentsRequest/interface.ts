import {
  PaymentRequestTypeDto,
  PaymentStatus,
} from '@/utils/interfaces/payment'
import { User } from '../User/interfaces'

export interface IPaymentRequest {
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
  PaymentRequestType?: PaymentRequestTypeDto | null
  paymentRequestTypeId?: number | null
}
