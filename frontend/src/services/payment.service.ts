import http from '@/lib/http'
import { SignedURLResponse, SuccessResponse } from '@/utils/constants/routes'
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

const cancelPayment = async (id: number, reason: string) => {
  return http.patch<SuccessResponse>(`/payment-admin/${id}`, {
    status: 'CANCELLED',
    reason,
  })
}

const finishPayment = async (id: number, reason: string, file: File) => {
  await http.patch<SuccessResponse>(`/payment-admin/${id}`, {
    status: 'CANCELLED',
    reason,
  })
  const formData = new FormData()
  formData.append('file', file)
  const fileResponse = await http.post<SuccessResponse>(
    `/payment-admin/${id}/finish/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return fileResponse
}

const getSignedURL = async (id: number) => {
  return http.get<SignedURLResponse>(`/payment-admin/signed_url/${id}`)
}

const Paymentservice = {
  getPayments,
  createPayment,
  cancelPayment,
  finishPayment,
  update,
  get,
  getSignedURL,
}

export default Paymentservice
