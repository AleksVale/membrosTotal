import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/auth/value-objects/role.vo';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'clx123abc456def789',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'collaborator'],
    example: 'collaborator',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Whether the email has been verified',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
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
