import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

import {
  CreateModuleResponse,
  GetModuleResponse,
  IModule,
} from '@/pages/admin/Modules/interfaces'
import { CreateModuleDTO } from '@/pages/admin/Modules/validation'

const getModules = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<IModule>>(
    `/training-modules-admin?${searchParams.toString()}`,
  )
}

const getModule = async (id: string | undefined) => {
  return http.get<GetModuleResponse>(`/training-modules-admin/${id}`)
}
const createModule = async (module: CreateModuleDTO) => {
  return http.post<CreateModuleResponse>('/training-modules-admin', module)
}

const update = async (module: CreateModuleDTO, id: number | string) => {
  return http.patch<IModule>(`/training-modules-admin/${id}`, module)
}

const createPhotoModule = async (file: File, moduleId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `training-modules-admin/${moduleId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const createModulePermissions = async (
  addedUsers: number[],
  removedUsers: number[],
  addRelatives: boolean,
  id: number | string,
) => {
  return http.patch<SuccessResponse>(
    `/training-modules-admin/permissions/${id}`,
    {
      addedUsers,
      removedUsers,
      addRelatives,
    },
  )
}

const ModuleService = {
  getModules,
  createModule,
  update,
  getModule,
  createPhotoModule,
  createModulePermissions,
}

export default ModuleService
