import { SuccessResponse } from '@/utils/constants/routes'

export interface PermissionUserModule {
  id: number
  userId: number
  moduleId: number
  createdAt: string
  updatedAt: string
}

export interface IModule {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
  PermissionUserModule: PermissionUserModule[]
}

export interface GetModuleResponse {
  module: IModule
  stream: ArrayBuffer
}

export interface CreateModuleResponse extends SuccessResponse {
  id: number
}
