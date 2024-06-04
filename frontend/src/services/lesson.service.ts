import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

import {
  CreateLessonResponse,
  GetLessonResponse,
  ILesson,
} from '@/pages/admin/Lessons/interfaces'
import { CreateLessonDTO } from '@/pages/admin/Lessons/validation'

const getLessons = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<ILesson>>(
    `/lessons-admin?${searchParams.toString()}`,
  )
}

const getLesson = async (id: string | undefined) => {
  return http.get<GetLessonResponse>(`/lessons-admin/${id}`)
}
const createLesson = async (lesson: CreateLessonDTO) => {
  return http.post<CreateLessonResponse>('/lessons-admin', lesson)
}

const update = async (lesson: CreateLessonDTO, id: number | string) => {
  return http.patch<ILesson>(`/lessons-admin/${id}`, lesson)
}

const createPhotoLesson = async (file: File, lessonId: number) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<SuccessResponse>(
    `lessons-admin/${lessonId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

const deleteLesson = async (id: number | string) => {
  return http.delete(`/lessons-admin/${id}`)
}

const LessonService = {
  getLessons,
  createLesson,
  update,
  getLesson,
  createPhotoLesson,
  deleteLesson,
}

export default LessonService
