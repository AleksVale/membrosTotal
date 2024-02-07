export const ADMIN_PAGES = {
  prefix: '/admin',
  home: '/admin/home',
  listUsers: '/admin/user?page=1&per_page=10',
  createUser: '/admin/user/new',
  listMeetings: '/admin/meetings?page=1&per_page=10',
  createMeeting: '/admin/meetings/new',
  settings: '/admin/settings',
}

export const AUTH_PAGES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
}

export interface SuccessResponse {
  success: boolean
}

export const DEFAULT_META_PAGINATION = {
  currentPage: 1,
  lastPage: 1,
  next: 1,
  perPage: 10,
  prev: 1,
  total: 0,
}
