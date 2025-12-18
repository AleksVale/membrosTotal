import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/auth/entities/user.entity';
import { UserRepositoryInterface } from '../../../domain/auth/repositories/user.repository.interface';
import { Role } from '../../../domain/auth/value-objects/role.vo';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const prismaUser = await (this.prisma as any).user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return this.toDomainEntity(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await (this.prisma as any).user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return this.toDomainEntity(prismaUser);
  }

  async update(
    id: string,
    updates: Partial<Pick<User, 'name' | 'image'>>,
  ): Promise<User> {
    const prismaUser = await (this.prisma as any).user.update({
      where: { id },
      data: {
        name: updates.name,
        image: updates.image ?? undefined,
      },
    });

    return this.toDomainEntity(prismaUser);
  }

  async exists(id: string): Promise<boolean> {
    const count = await (this.prisma as any).user.count({
      where: { id },
    });
    return count > 0;
  }

  private toDomainEntity(prismaUser: {
    id: string;
    email: string;
    name: string;
    role: string | null;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const role = new Role(prismaUser.role || 'collaborator');

    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      role,
      prismaUser.emailVerified,
      prismaUser.image,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
