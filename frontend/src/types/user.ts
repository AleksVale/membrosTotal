export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo?: string;
  avatar?: string;
}

export type UserRole = "admin" | "employee" | "student";