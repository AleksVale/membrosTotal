import { Module } from '@nestjs/common';
import { InfrastructureAuthModule } from '../../infrastructure/auth/auth.module';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';

@Module({
  imports: [InfrastructureAuthModule],
  providers: [GetCurrentUserUseCase, UpdateProfileUseCase],
  exports: [GetCurrentUserUseCase, UpdateProfileUseCase],
})
export class ApplicationAuthModule {}
