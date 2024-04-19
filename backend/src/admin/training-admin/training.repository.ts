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
      include: {
        PermissionUserTraining: true,
      },
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

  async remove(where: Prisma.TrainingWhereUniqueInput) {
    await this.prisma.permissionUserTraining.deleteMany({
      where: {
        trainingId: where.id,
      },
    });

    return await this.prisma.training.delete({ where });
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

  async addUsersToTraining(id: number, users: number[]) {
    await this.prisma.permissionUserTraining.createMany({
      data: users.map((userId) => ({
        userId,
        trainingId: id,
      })),
    });
  }

  async addUsersToModule(id: number, users: number[]) {
    await this.prisma.permissionUserModule.createMany({
      data: users.map((userId) => ({
        userId,
        moduleId: id,
      })),
    });
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
    trainingId: number,
    deletedUsers: number[] | undefined,
    addedUsers: number[] | undefined,
    addRelatives: boolean | undefined,
  ) {
    await this.prisma.permissionUserTraining.deleteMany({
      where: {
        trainingId,
        userId: {
          in: deletedUsers,
        },
      },
    });
    const modules = addRelatives
      ? await this.prisma.module.findMany({
          where: {
            trainingId,
          },
        })
      : undefined;

    const submodules = addRelatives
      ? await this.prisma.submodule.findMany({
          where: {
            moduleId: {
              in: modules?.map((module) => module.id),
            },
          },
        })
      : undefined;
    if (addedUsers) {
      await this.addUsersToTraining(trainingId, addedUsers);
      if (addRelatives) {
        modules?.forEach(
          async (module) => await this.addUsersToModule(module.id, addedUsers),
        );
        submodules?.forEach(
          async (submodule) =>
            await this.addUsersToSubmodule(submodule.id, addedUsers),
        );
      }
    }
    if (deletedUsers) {
      modules?.forEach(
        async (module) =>
          await this.prisma.permissionUserModule.deleteMany({
            where: {
              moduleId: module.id,
              userId: {
                in: deletedUsers,
              },
            },
          }),
      );
      submodules?.forEach(
        async (module) =>
          await this.prisma.permissionUserModule.deleteMany({
            where: {
              moduleId: module.id,
              userId: {
                in: deletedUsers,
              },
            },
          }),
      );
    }
  }
}
