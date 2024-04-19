import http from '@/lib/http'
import { ExpertForm } from '@/pages/expert/validation'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

export interface ExpertResponse {
  id: number
  instagram: string
  youtube?: string
  platforms: string
  hasProduct: string
  invoiced: number
  productLink?: string
  budget: number
  compromised: string
  searching: string
  diferential: string
  extraInfo: string
  whatsapp: string
  createdAt: Date
  updatedAt: Date
}

const create = async (data: ExpertForm) => {
  return http.post<SuccessResponse>('/public/expert-request', data)
}

const get = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<ExpertResponse>>(
    `/expert-request?${searchParams}`,
  )
}

const ExpertRequestService = {
  create,
  get,
}

export default ExpertRequestService
