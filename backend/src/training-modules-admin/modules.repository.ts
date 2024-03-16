import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ModuleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ModuleUncheckedCreateInput) {
    return await this.prisma.module.create({ data });
  }

  async find(condition: Prisma.ModuleWhereInput) {
    return await this.prisma.module.findFirst({
      where: condition,
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

  async findAll(options: any) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<any, Prisma.ModuleFindManyArgs>(
      this.prisma.module,
      {
        where: {
          title: {
            contains: options.title,
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          submodules: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
