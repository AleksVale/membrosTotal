import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async find(condition: Prisma.ProfileWhereInput) {
    return await this.prisma.profile.findFirst({
      where: condition,
    });
  }

  async findWithUser(condition: Prisma.ProfileWhereInput) {
    return await this.prisma.profile.findFirst({
      where: condition,
      include: { User: true },
    });
  }
}
