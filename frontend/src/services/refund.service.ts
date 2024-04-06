import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { IRefund } from '@/pages/admin/Refunds/interface'

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

const cancelRefund = async (id: number) => {
  return http.patch<SuccessResponse>(`/refund-admin/${id}`, {
    status: 'CANCELLED',
    reason: 'Cancelado pelo administrador',
  })
}

const finishRefund = async (id: number) => {
  return http.patch<SuccessResponse>(`/refund-admin/${id}`, {
    status: 'APPROVED',
  })
}

const Refundservice = {
  getRefunds,
  createRefund,
  cancelRefund,
  finishRefund,
  update,
  get,
}

export default Refundservice
