import http from '@/lib/http'
import { ExpertForm } from '@/pages/expert/validation'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { FormValues } from '@/temp/Teste'
import { IQuestionario } from '@/pages/admin/Questionario/interface'

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

const getVideo = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<IQuestionario>>(
    `/expert-request/video-job?${searchParams}`,
  )
}

const createVideoJob = async (data: FormValues) => {
  return http.post<SuccessResponse>('/public/expert-request/video-job', {
    ...data.questionario,
    ...data.pessoal,
    ...data.disponibilidade,
  })
}

const ExpertRequestService = {
  create,
  get,
  createVideoJob,
  getVideo,
}

export default ExpertRequestService
