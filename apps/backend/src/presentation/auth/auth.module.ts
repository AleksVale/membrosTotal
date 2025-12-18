import { Module } from '@nestjs/common';
import { ApplicationAuthModule } from '../../application/auth/auth.module';
import { InfrastructureAuthModule } from '../../infrastructure/auth/auth.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ApplicationAuthModule, InfrastructureAuthModule],
  controllers: [AuthController],
})
export class PresentationAuthModule {}
