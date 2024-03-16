import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

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

  async findAll(options: any) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<any, Prisma.SubmoduleFindManyArgs>(
      this.prisma.submodule,
      {
        where: {
          title: {
            contains: options.title,
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          lessons: true,
          PermissionUserSubModule: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
