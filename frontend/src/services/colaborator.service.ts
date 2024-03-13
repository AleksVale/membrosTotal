import http from '@/lib/http'
import { User } from '@/pages/admin/User/interfaces'
import { EditProfileForm } from '@/pages/collaborator/Profile/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { Meeting } from './meeting.service'
import { PaginatedResponseDto } from './interfaces'
import { Payment, PaymentResponseDto } from '../utils/interfaces/payment'
import { CreatePaymentDTO } from '@/pages/collaborator/Payments/validation'
import { CreatePaymentRequestDTO } from '@/pages/collaborator/PaymentRequests/validation'

interface CreatePaymentResponse extends SuccessResponse {
  id: number
}

const getCurrentUser = async () => {
  return http.get<User>(`collaborator/user`)
}

const update = async (user: EditProfileForm) => {
  return http.patch<SuccessResponse>(`collaborator/user`, user)
}

const getMeetings = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<Meeting>>(
    `collaborator/meetings?${searchParams}`,
  )
}

const getPayments = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<Payment>>(
    `collaborator/payments?${searchParams}`,
  )
}

const createPayment = async (payment: CreatePaymentDTO) => {
  return http.post<CreatePaymentResponse>('collaborator/payments', payment)
}

const createPaymentRequest = async (payment: CreatePaymentRequestDTO) => {
  return http.post<CreatePaymentResponse>(
    'collaborator/payment_requests',
    payment,
  )
}

const createPhotoPayment = async (file: File, paymentId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `collaborator/payments/${paymentId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const createPhotoPaymentRequest = async (file: File, paymentId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `collaborator/payment_requests/${paymentId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const getPaymentRequests = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<PaymentResponseDto>>(
    `collaborator/payment_requests?${searchParams}`,
  )
}

const ColaboratorService = {
  update,
  getCurrentUser,
  getMeetings,
  getPayments,
  createPayment,
  createPhotoPayment,
  getPaymentRequests,
  createPaymentRequest,
  createPhotoPaymentRequest,
}

export default ColaboratorService
