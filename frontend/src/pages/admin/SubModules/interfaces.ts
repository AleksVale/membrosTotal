import { SuccessResponse } from '@/utils/constants/routes'
export interface PermissionUserSubmodule {
  id: number
  userId: number
  submoduleId: number
  createdAt: string
  updatedAt: string
}
export interface ISubModule {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
  PermissionUserSubmodule: PermissionUserSubmodule[]
}

export interface GetSubModuleResponse {
  submodule: ISubModule
  stream: ArrayBuffer
}

export interface CreateSubModuleResponse extends SuccessResponse {
  id: number
}
