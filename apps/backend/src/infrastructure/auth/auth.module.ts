import { Module } from '@nestjs/common';
import { UserRepositoryInterface } from '../../domain/auth/repositories/user.repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: UserRepository,
    },
  ],
  exports: [UserRepositoryInterface],
})
export class InfrastructureAuthModule {}
