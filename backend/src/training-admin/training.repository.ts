import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class TrainingRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TrainingUncheckedCreateInput) {
    return await this.prisma.training.create({ data });
  }

  async find(condition: Prisma.TrainingWhereInput) {
    return await this.prisma.training.findFirst({
      where: condition,
    });
  }

  async update(
    training: Prisma.TrainingUpdateInput,
    where: Prisma.TrainingWhereUniqueInput,
  ) {
    return await this.prisma.training.update({
      data: training,
      where: where,
    });
  }

  async findAll(options: any) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<any, Prisma.TrainingFindManyArgs>(
      this.prisma.training,
      {
        where: {
          title: {
            contains: options.title,
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          Module: {
            include: {
              submodules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
          PermissionUserTraining: true,
        },
      },
      {
        page: options.page,
      },
    );
  }
}
