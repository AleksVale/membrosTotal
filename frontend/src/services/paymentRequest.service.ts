import http from '@/lib/http'
import { SignedURLResponse, SuccessResponse } from '@/utils/constants/routes'
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

const cancelPaymentRequest = async (id: number, cancelReason: string) => {
  return http.patch<SuccessResponse>(`/payment-request-admin/${id}`, {
    status: 'CANCELLED',
    reason: cancelReason,
  })
}

const finishPaymentRequest = async (id: number, reason: string, file: File) => {
  await http.patch<SuccessResponse>(`/payment-request-admin/${id}`, {
    status: 'CANCELLED',
    reason,
  })
  const formData = new FormData()
  formData.append('file', file)
  const fileResponse = await http.post<SuccessResponse>(
    `/payment-request-admin/${id}/finish/file`,
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
  return http.get<SignedURLResponse>(`/payment-request-admin/signed_url/${id}`)
}

const PaymentRequestservice = {
  getPaymentRequests,
  createPaymentRequest,
  cancelPaymentRequest,
  finishPaymentRequest,
  update,
  get,
  getSignedURL,
}

export default PaymentRequestservice
