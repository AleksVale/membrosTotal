import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserResponseDTO } from './dto/user-response.dto';
import { createPaginator } from 'prisma-pagination';
import { UserFilter } from './user.service';

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

  async findAll(options: UserFilter) {
    const paginate = createPaginator({ perPage: options.per_page });
    let userIds: number[] | undefined = undefined;
    if (options.name) {
      const ids = await this.prisma.$queryRaw<{ id: number }[]>`
    SELECT id
    FROM users
    WHERE CONCAT(firstName, ' ', lastName) LIKE ${`%${options.name}%`}
  `;
      userIds = ids.map((user) => user.id);
    }

    return paginate<UserResponseDTO, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          id: { in: userIds },
          email: { contains: options.email },
          profileId: options.profile ? parseInt(options.profile) : undefined,
        },
        orderBy: { email: 'asc' },
        include: {
          Profile: true,
          UserMeeting: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
