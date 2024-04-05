export enum Profile {
  ADMIN = 'admin',
  EXPERT = 'expert',
  EMPLOYEE = 'employee',
}

export interface ProfileOptions {
  id: number
  name: Profile
  label: string
}
