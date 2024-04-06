import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { IPaymentRequest } from '@/pages/admin/PaymentsRequest/interface'

const getPaymentRequests = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<IPaymentRequest>>(
    `/payment-request-admin?${searchParams.toString()}`,
  )
}

const get = async (id: string) => {
  return http.get<IPaymentRequest>(`/payment-request-admin/${id}`)
}
const createPaymentRequest = async (paymentRequest: unknown) => {
  return http.post<SuccessResponse>('/payment-request-admin', paymentRequest)
}

const update = async (paymentRequest: unknown, id: string) => {
  return http.patch<SuccessResponse>(
    `/payment-request-admin/${id}`,
    paymentRequest,
  )
}

const cancelPaymentRequest = async (id: number) => {
  return http.patch<SuccessResponse>(`/payment-request-admin/${id}`, {
    status: 'CANCELLED',
    reason: 'Cancelado pelo administrador',
  })
}

const finishPaymentRequest = async (id: number) => {
  return http.patch<SuccessResponse>(`/payment-request-admin/${id}/finish`)
}

const PaymentRequestservice = {
  getPaymentRequests,
  createPaymentRequest,
  cancelPaymentRequest,
  finishPaymentRequest,
  update,
  get,
}

export default PaymentRequestservice
