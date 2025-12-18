import { UserRole } from '../../../domain/auth/value-objects/role.vo';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.emailVerified = user.emailVerified;
    this.image = user.image;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
