import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateProfileDto } from '../../../application/auth/dto/update-profile.dto';
import { UserResponseDto } from '../../../application/auth/dto/user-response.dto';
import { GetCurrentUserUseCase } from '../../../application/auth/use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from '../../../application/auth/use-cases/update-profile.use-case';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(
    @Session() session: UserSession,
  ): Promise<UserResponseDto> {
    return this.getCurrentUserUseCase.execute(session.user.id);
  }

  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
