import http from '@/lib/http'
import { ExpertForm } from '@/pages/expert/validation'
import { SuccessResponse } from '@/utils/constants/routes'

const create = async (data: ExpertForm) => {
  return http.post<SuccessResponse>('/expert-request', data)
}

const ExpertRequestService = {
  create,
}

export default ExpertRequestService
