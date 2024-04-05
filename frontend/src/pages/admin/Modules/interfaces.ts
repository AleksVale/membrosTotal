import { SuccessResponse } from '@/utils/constants/routes'

export interface IModule {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface GetModuleResponse {
  module: IModule
  stream: ArrayBuffer
}

export interface CreateModuleResponse extends SuccessResponse {
  id: number
}
