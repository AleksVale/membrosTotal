import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import {
  CreateTrainingResponse,
  GetTrainingResponse,
  ITraining,
} from '@/pages/admin/Training/interfaces'
import { CreateTrainingDTO } from '@/pages/admin/Training/validation'

const getTrainings = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<ITraining>>(
    `/training-admin?${searchParams.toString()}`,
  )
}

const getTraining = async (id: string | undefined) => {
  return http.get<GetTrainingResponse>(`/training-admin/${id}`)
}
const createTraining = async (training: CreateTrainingDTO) => {
  return http.post<CreateTrainingResponse>('/training-admin', training)
}

const update = async (training: CreateTrainingDTO, id: number | string) => {
  return http.patch<ITraining>(`/training-admin/${id}`, training)
}

const createPhotoTraining = async (file: File, trainingId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `training-admin/${trainingId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const createTrainingPermissions = async (
  addedUsers: number[],
  removedUsers: number[],
  addRelatives: boolean,
  id: number | string,
) => {
  return http.patch<SuccessResponse>(`/training-admin/permissions/${id}`, {
    addedUsers,
    removedUsers,
    addRelatives,
  })
}

const deleteTraining = async (id: number | string) => {
  return http.delete<SuccessResponse>(`/training-admin/${id}`)
}

const TrainingService = {
  getTrainings,
  createTraining,
  update,
  getTraining,
  createPhotoTraining,
  createTrainingPermissions,
  deleteTraining,
}

export default TrainingService
