import http from '@/lib/http'
import { IGetProfileResponse } from '@/pages/admin/User/interfaces'
import { EditProfileForm } from '@/pages/collaborator/Profile/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { Meeting } from './meeting.service'
import { PaginatedResponseDto } from './interfaces'
import {
  Payment,
  PaymentResponseDto,
  RefundResponseDto,
} from '../utils/interfaces/payment'
import { CreatePaymentDTO } from '@/pages/collaborator/Payments/validation'
import { CreatePaymentRequestDTO } from '@/pages/collaborator/PaymentRequests/validation'
import { CreateRefundDTO } from '@/pages/collaborator/Refunds/validation'
import { ITraining } from '@/pages/admin/Training/interfaces'
import { ISubModule } from '@/pages/admin/SubModules/interfaces'
import { IModule } from '@/pages/admin/Modules/interfaces'
import { ILesson } from '@/pages/admin/Lessons/interfaces'

interface CreatePaymentResponse extends SuccessResponse {
  id: number
}

const getCurrentUser = async () => {
  return http.get<IGetProfileResponse>(`collaborator/user`)
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

const getPayment = async (id?: string) => {
  return http.get<Payment>(`collaborator/payments/${id}`)
}

const createPayment = async (payment: CreatePaymentDTO) => {
  return http.post<CreatePaymentResponse>('collaborator/payments', payment)
}

const updatePayment = async (id: string, payment: CreatePaymentDTO) => {
  return http.patch<CreatePaymentResponse>(
    `collaborator/payments/${id}`,
    payment,
  )
}

const createPaymentRequest = async (payment: CreatePaymentRequestDTO) => {
  return http.post<CreatePaymentResponse>(
    'collaborator/payment_requests',
    payment,
  )
}

const createRefund = async (refund: CreateRefundDTO) => {
  return http.post<CreatePaymentResponse>('collaborator/refunds', refund)
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

const createPhotoUser = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.patch<SuccessResponse>(`collaborator/user/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const createPhotoRefund = async (file: File, refundId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `collaborator/refunds/${refundId}/file`,
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

const getRefunds = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<RefundResponseDto>>(
    `collaborator/refunds?${searchParams}`,
  )
}

const deletePayment = async (id: number, reason: string) => {
  return http.delete<SuccessResponse>(`collaborator/payments/${id}`, {
    data: { reason },
  })
}

const deletePaymentRequest = async (id: number, reason: string) => {
  return http.delete<SuccessResponse>(`collaborator/payment_requests/${id}`, {
    data: { reason },
  })
}

const deleteRefund = async (id: number, reason: string) => {
  return http.delete<SuccessResponse>(`collaborator/refunds/${id}`, {
    data: { reason },
  })
}

const getRefund = async (id: number) => {
  return http.get<RefundResponseDto>(`collaborator/refunds/${id}`)
}

const getTrainings = async () => {
  return http.get<ITraining[]>(`collaborator/training-collaborator`)
}

const getModules = async (id?: string) => {
  return http.get<IModule[]>(
    `collaborator/module-collaborator?trainingId=${id}`,
  )
}

const getSubmodules = async (id?: string) => {
  return http.get<ISubModule[]>(
    `collaborator/submodules-collaborator?moduleId=${id}`,
  )
}

const getLessons = async (id?: string) => {
  return http.get<ILesson[]>(
    `collaborator/lessons-collaborator?submoduleId=${id}`,
  )
}

const viewLesson = async (id?: number) => {
  return http.post<SuccessResponse>(`collaborator/lessons-collaborator`, {
    id,
  })
}

const ColaboratorService = {
  viewLesson,
  update,
  getCurrentUser,
  getMeetings,
  getPayments,
  createPayment,
  createPhotoPayment,
  getPaymentRequests,
  createPaymentRequest,
  createPhotoPaymentRequest,
  getRefunds,
  createRefund,
  createPhotoRefund,
  deletePayment,
  deletePaymentRequest,
  deleteRefund,
  getRefund,
  getTrainings,
  getModules,
  getSubmodules,
  getLessons,
  createPhotoUser,
  updatePayment,
  getPayment,
}

export default ColaboratorService
