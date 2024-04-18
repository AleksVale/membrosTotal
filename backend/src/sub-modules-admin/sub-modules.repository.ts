import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { SubModulesQuery } from './sub-modules-admin.service';
import { SubmoduleDTO } from './dto/sub-modules-response.dto';

@Injectable()
export class SubModuleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SubmoduleUncheckedCreateInput) {
    return await this.prisma.submodule.create({ data });
  }

  async find(condition: Prisma.SubmoduleWhereInput) {
    return await this.prisma.submodule.findFirst({
      where: condition,
    });
  }

  async update(
    submodule: Prisma.SubmoduleUpdateInput,
    where: Prisma.SubmoduleWhereUniqueInput,
  ) {
    return await this.prisma.submodule.update({
      data: submodule,
      where: where,
    });
  }

  async findAll(options: SubModulesQuery) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<SubmoduleDTO, Prisma.SubmoduleFindManyArgs>(
      this.prisma.submodule,
      {
        where: {
          title: {
            contains: options.title,
          },
          moduleId: options.moduleId,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          module: true,
          PermissionUserSubModule: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async addUsersToSubmodule(id: number, users: number[]) {
    await this.prisma.permissionUserSubModule.createMany({
      data: users.map((userId) => ({
        userId,
        submoduleId: id,
      })),
    });
  }

  async addPermission(
    submoduleId: number,
    deletedUsers: number[] | undefined,
    addedUsers: number[] | undefined,
  ) {
    await this.prisma.permissionUserSubModule.deleteMany({
      where: {
        submoduleId,
        userId: {
          in: deletedUsers,
        },
      },
    });
    if (addedUsers) {
      await this.addUsersToSubmodule(submoduleId, addedUsers);
    }
  }
}
