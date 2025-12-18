import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateProfileDto } from '../../../application/auth/dto/update-profile.dto';
import { UserResponseDto } from '../../../application/auth/dto/user-response.dto';
import { GetCurrentUserUseCase } from '../../../application/auth/use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from '../../../application/auth/use-cases/update-profile.use-case';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
  async getCurrentUser(
    @Session() session: UserSession,
  ): Promise<UserResponseDto> {
    return this.getCurrentUserUseCase.execute(session.user.id);
  }

  @Patch('me')
  async updateProfile(
    @Session() session: UserSession,
    @Body() updateDto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    const applicationDto = new UpdateProfileDto({
      name: updateDto.name,
      image: updateDto.image,
    });

    return this.updateProfileUseCase.execute(session.user.id, applicationDto);
  }
}
