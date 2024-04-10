import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import {
  CreateSubModuleResponse,
  GetSubModuleResponse,
  ISubModule,
} from '@/pages/admin/SubModules/interfaces'
import { CreateSubModuleDTO } from '@/pages/admin/SubModules/validation'

const getSubModules = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<ISubModule>>(
    `/sub-modules-admin?${searchParams.toString()}`,
  )
}

const getSubModule = async (id: string | undefined) => {
  return http.get<GetSubModuleResponse>(`/sub-modules-admin/${id}`)
}
const createSubModule = async (subModule: CreateSubModuleDTO) => {
  return http.post<CreateSubModuleResponse>('/sub-modules-admin', subModule)
}

const update = async (subModule: CreateSubModuleDTO, id: number | string) => {
  return http.patch<ISubModule>(`/sub-modules-admin/${id}`, subModule)
}

const createPhotoSubModule = async (file: File, subModuleId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `sub-modules-admin/${subModuleId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const createSubmodulePermissions = async (
  submodules: number[],
  users: number[],
) => {
  return http.post<SuccessResponse>('/sub-modules-admin/permissions', {
    submodules,
    users,
  })
}

const SubModuleService = {
  getSubModules,
  createSubModule,
  update,
  getSubModule,
  createPhotoSubModule,
  createSubmodulePermissions,
}

export default SubModuleService
