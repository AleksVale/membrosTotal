import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { TrainingDTO } from './dto/training-response.dto';
import { TrainingQuery } from './training-admin.service';

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

  async findAll(options: TrainingQuery) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<TrainingDTO, Prisma.TrainingFindManyArgs>(
      this.prisma.training,
      {
        where: {
          title: {
            contains: options.title,
          },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          Module: true,
          PermissionUserTraining: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async addPermission(id: number, users: number[]) {
    await this.prisma.permissionUserTraining.deleteMany({
      where: { trainingId: id },
    });
    await this.prisma.permissionUserTraining.createMany({
      data: users.map((userId) => ({
        userId,
        trainingId: id,
      })),
    });
  }
}
