import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../domain/auth/entities/user.entity';
import { UserRepositoryInterface } from '../../../domain/auth/repositories/user.repository.interface';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.getValue(),
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
