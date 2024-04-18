import { SuccessResponse } from '@/utils/constants/routes'

export interface PermissionUserTraining {
  id: number
  userId: number
  trainingId: number
  createdAt: string
  updatedAt: string
}
export interface ITraining {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
  PermissionUserTraining: PermissionUserTraining[]
}

export interface GetTrainingResponse {
  training: ITraining
  stream: ArrayBuffer
}

export interface CreateTrainingResponse extends SuccessResponse {
  id: number
}
