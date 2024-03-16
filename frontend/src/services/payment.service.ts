import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { Payment } from '@/utils/interfaces/payment'

const getPayments = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<Payment>>(
    `/payment-admin?${searchParams.toString()}`,
  )
}

const get = async (id: string) => {
  return http.get<Payment>(`/payment-admin/${id}`)
}
const createPayment = async (payment: unknown) => {
  return http.post<SuccessResponse>('/payment-admin', payment)
}

const update = async (payment: unknown, id: string) => {
  return http.patch<SuccessResponse>(`/payment-admin/${id}`, payment)
}

const cancelPayment = async (id: number) => {
  return http.patch<SuccessResponse>(`/payment-admin/${id}/cancel`)
}

const finishPayment = async (id: number) => {
  return http.patch<SuccessResponse>(`/payment-admin/${id}/finish`)
}

const Paymentservice = {
  getPayments,
  createPayment,
  cancelPayment,
  finishPayment,
  update,
  get,
}

export default Paymentservice
