export interface PaginationMeta {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number | null
  next: number | null
}

export interface PaginatedResponseDto<T> {
  data: T[]
  meta: PaginationMeta
}

export interface IGetPicturesResponse {
  picture: string | null
}
