import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { TrainingModulesAdminQuery } from './training-modules-admin.service';
import { ModuleDTO } from './dto/module-response.dto';
import { TrainingRepository } from 'src/admin/training-admin/training.repository';

@Injectable()
export class ModuleRepository {
  constructor(
    private prisma: PrismaService,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async create(data: Prisma.ModuleUncheckedCreateInput) {
    return await this.prisma.module.create({ data });
  }

  async find(condition: Prisma.ModuleWhereInput) {
    return await this.prisma.module.findFirst({
      where: condition,
      include: {
        training: true,
        PermissionUserModule: true,
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

  async remove(where: Prisma.ModuleWhereUniqueInput) {
    await this.prisma.permissionUserModule.deleteMany({
      where: {
        moduleId: where.id,
      },
    });
    return this.prisma.module.delete({ where });
  }

  async removeByTrainingId(trainingId: number) {
    await this.prisma.permissionUserModule.deleteMany({
      where: {
        Module: {
          trainingId,
        },
      },
    });
    return this.prisma.module.deleteMany({
      where: {
        trainingId,
      },
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
        orderBy: { order: 'asc' },
        include: {
          training: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async addPermission(
    moduleId: number,
    deletedUsers: number[] | undefined,
    addedUsers: number[] | undefined,
    addRelatives: boolean | undefined,
  ) {
    await this.prisma.permissionUserModule.deleteMany({
      where: {
        moduleId,
        userId: {
          in: deletedUsers,
        },
      },
    });

    const trainings = addRelatives
      ? await this.prisma.training.findMany({
          where: {
            Module: {
              some: {
                id: moduleId,
              },
            },
          },
        })
      : undefined;

    const submodules = addRelatives
      ? await this.prisma.submodule.findMany({
          where: {
            moduleId,
          },
        })
      : undefined;

    if (addedUsers) {
      await this.trainingRepository.addUsersToModule(moduleId, addedUsers);
      if (addRelatives) {
        trainings?.forEach(
          async (training) =>
            await this.trainingRepository.addUsersToTraining(
              training.id,
              addedUsers,
            ),
        );
        submodules?.forEach(
          async (submodule) =>
            await this.trainingRepository.addUsersToSubmodule(
              submodule.id,
              addedUsers,
            ),
        );
      }
    }

    if (deletedUsers) {
      if (addRelatives) {
        trainings?.forEach(
          async (training) =>
            await this.prisma.permissionUserTraining.deleteMany({
              where: {
                trainingId: training.id,
                userId: {
                  in: deletedUsers,
                },
              },
            }),
        );
      }
      submodules?.forEach(
        async (submodule) =>
          await this.prisma.permissionUserSubModule.deleteMany({
            where: {
              submoduleId: submodule.id,
              userId: {
                in: deletedUsers,
              },
            },
          }),
      );
    }
  }
}
