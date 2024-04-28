import { SuccessResponse } from '@/utils/constants/routes'

export interface IUserViewLesson {
  id: number
  userId: number
  lessonId: number
  createdAt: Date
  updatedAt: Date
}

export interface ILesson {
  id: number
  title: string
  description: string
  content: string
  submoduleId: number
  thumbnail?: string | null
  createdAt: Date
  updatedAt: Date
  UserViewLesson: IUserViewLesson[]
}

export interface GetLessonResponse {
  lesson: ILesson
  stream: ArrayBuffer
}

export interface CreateLessonResponse extends SuccessResponse {
  id: number
}
