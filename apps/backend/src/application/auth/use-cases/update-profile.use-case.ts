import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from '../../../domain/auth/repositories/user.repository.interface';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const exists = await this.userRepository.exists(userId);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    if (!updateDto.hasUpdates()) {
      throw new Error('No updates provided');
    }

    const updates = updateDto.getDefinedFields();

    const updatedUser = await this.userRepository.update(userId, updates);

    return new UserResponseDto({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role.getValue(),
      emailVerified: updatedUser.emailVerified,
      image: updatedUser.image,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }
}
