import { SuccessResponse } from '@/utils/constants/routes'

export interface ITraining {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface GetTrainingResponse {
  training: ITraining
  stream: ArrayBuffer
}

export interface CreateTrainingResponse extends SuccessResponse {
  id: number
}