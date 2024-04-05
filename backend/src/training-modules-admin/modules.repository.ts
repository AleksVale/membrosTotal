import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { TrainingModulesAdminQuery } from './training-modules-admin.service';
import { ModuleDTO } from './dto/module-response.dto';

@Injectable()
export class ModuleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ModuleUncheckedCreateInput) {
    return await this.prisma.module.create({ data });
  }

  async find(condition: Prisma.ModuleWhereInput) {
    return await this.prisma.module.findFirst({
      where: condition,
      include: {
        training: true,
      },
    });
  }

  async update(
    module: Prisma.ModuleUpdateInput,
    where: Prisma.ModuleWhereUniqueInput,
  ) {
    return await this.prisma.module.update({
      data: module,
      where: where,
    });
  }

  async findAll(options: TrainingModulesAdminQuery) {
    const paginate = createPaginator({ perPage: options.per_page });
    return paginate<ModuleDTO, Prisma.ModuleFindManyArgs>(
      this.prisma.module,
      {
        where: {
          title: {
            contains: options.title,
          },
          trainingId: options.trainingId,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          training: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async addPermission(id: number, users: number[]) {
    await this.prisma.permissionUserModule.deleteMany({
      where: { moduleId: id },
    });

    await this.prisma.permissionUserModule.createMany({
      data: users.map((userId) => ({
        userId,
        moduleId: id,
      })),
    });
  }
}
