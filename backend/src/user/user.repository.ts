import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async find(condition: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({
      where: condition,
      include: {
        Profile: true,
      },
    });
  }

  async update(
    user: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ) {
    return await this.prisma.user.update({
      data: user,
      where: where,
    });
  }

  async findAll(options: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany({
      ...options,
    });
  }
}
