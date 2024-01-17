import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [ProfileService, ProfileRepository, PrismaService],
})
export class ProfileModule {}
