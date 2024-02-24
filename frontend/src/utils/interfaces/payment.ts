import { User } from '../../pages/admin/User/interfaces'

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
}

export enum PaymentLabel {
  PENDING = 'Pendente',
  PAID = 'Pago',
  CANCELLED = 'Cancelado',
  APPROVED = 'Aprovado',
  ALL = 'Todos',
}

export interface PaymentType {
  id: number
  label: string
}

export interface PaymentExpert {
  id: number
  userId: number
  paymentId: number
  createdAt: Date
  updatedAt: Date
  User: User
}

export interface Payment {
  id: number
  userId: number
  value: number
  paymentDate?: Date | null
  photoKey?: string | null
  status: PaymentStatus
  paidBy?: number | null
  description: string
  createdAt: Date
  updatedAt: Date
  User: User // Assuming User model is imported and defined elsewhere
  PaymentType?: PaymentType | null // Assuming PaymentType model is imported and defined elsewhere
  paymentTypeId?: number | null
  PaymentExpert: PaymentExpert[] // Assuming PaymentExpert model is imported and defined elsewhere
}
