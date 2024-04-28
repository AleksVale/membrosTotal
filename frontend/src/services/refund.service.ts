import http from '@/lib/http'
import { SignedURLResponse, SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { IRefund } from '@/pages/admin/Refunds/interface'
import { PaymentStatus } from '@/utils/interfaces/payment'

const getRefunds = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<IRefund>>(
    `/refund-admin?${searchParams.toString()}`,
  )
}

const get = async (id: string) => {
  return http.get<IRefund>(`/refund-admin/${id}`)
}
const createRefund = async (refund: unknown) => {
  return http.post<SuccessResponse>('/refund-admin', refund)
}

const update = async (refund: unknown, id: string) => {
  return http.patch<SuccessResponse>(`/refund-admin/${id}`, refund)
}

const cancelRefund = async (id: number, cancelReason: string) => {
  return http.patch<SuccessResponse>(`/refund-admin/${id}`, {
    status: PaymentStatus.CANCELLED,
    reason: cancelReason,
  })
}

const finishRefund = async (id: number, reason: string, file: File) => {
  await http.patch<SuccessResponse>(`/refund-admin/${id}`, {
    status: PaymentStatus.APPROVED,
    reason,
  })
  const formData = new FormData()
  formData.append('file', file)
  const fileResponse = await http.post<SuccessResponse>(
    `/refund-admin/${id}/finish/file`,
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
  return http.get<SignedURLResponse>(`/refund-admin/signed_url/${id}`)
}

const Refundservice = {
  getRefunds,
  createRefund,
  cancelRefund,
  finishRefund,
  update,
  get,
  getSignedURL,
}

export default Refundservice
