import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { TrainingRepository } from 'src/admin/training-admin/training.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmoduleDTO } from './dto/sub-modules-response.dto';
import { SubModulesQuery } from './sub-modules-admin.service';

@Injectable()
export class SubModuleRepository {
  constructor(
    private prisma: PrismaService,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async create(data: Prisma.SubmoduleUncheckedCreateInput) {
    return await this.prisma.submodule.create({ data });
  }

  async countSubmodules() {
    return await this.prisma.submodule.count();
  }

  async find(condition: Prisma.SubmoduleWhereInput) {
    return await this.prisma.submodule.findFirst({
      where: condition,
      include: { 
        PermissionUserSubModule: true,
        module: {
          include: {
            training: true
          }
        }
      },
    });
  }

  async getUsersWithPermission(submoduleId: number) {
    const permissions = await this.prisma.permissionUserSubModule.findMany({
      where: {
        submoduleId,
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Transformar para a estrutura esperada pelo frontend
    return permissions.map(permission => ({
      id: permission.id,
      userId: permission.userId,
      user: {
        id: permission.User.id,
        email: permission.User.email,
        firstName: permission.User.firstName,
        lastName: permission.User.lastName,
      }
    }));
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
        orderBy: { order: 'asc' },
        include: {
          module: {
            include: {
              training: true
            }
          },
          PermissionUserSubModule: true,
        },
      },
      {
        page: options.page,
      },
    );
  }

  async remove(where: Prisma.SubmoduleWhereUniqueInput) {
    await this.prisma.permissionUserSubModule.deleteMany({
      where: {
        submoduleId: where.id,
      },
    });
    await this.prisma.lesson.deleteMany({
      where: {
        submoduleId: where.id,
      },
    });
    return await this.prisma.submodule.delete({ where });
  }

  async removeByFK(args: Prisma.SubmoduleDeleteManyArgs) {
    await this.prisma.permissionUserSubModule.deleteMany({
      where: {
        Submodule: args.where,
      },
    });
    await this.prisma.lesson.deleteMany({
      where: {
        submodule: args.where,
      },
    });
    return await this.prisma.submodule.deleteMany(args);
  }

  async addPermission(
    submoduleId: number,
    deletedUsers: number[] | undefined,
    addedUsers: number[] | undefined,
    addRelatives: boolean | undefined,
  ) {
    await this.prisma.permissionUserSubModule.deleteMany({
      where: {
        submoduleId,
        userId: {
          in: deletedUsers,
        },
      },
    });

    const modules = addRelatives
      ? await this.prisma.module.findMany({
          where: {
            submodules: {
              some: {
                id: submoduleId,
              },
            },
          },
        })
      : undefined;

    const trainings = addRelatives
      ? await this.prisma.training.findMany({
          where: {
            Module: {
              some: {
                id: {
                  in: modules?.map((module) => module.id),
                },
              },
            },
          },
        })
      : undefined;

    if (addedUsers) {
      await this.trainingRepository.addUsersToSubmodule(
        submoduleId,
        addedUsers,
      );

      if (addRelatives) {
        modules?.forEach(
          async (module) =>
            await this.trainingRepository.addUsersToModule(
              module.id,
              addedUsers,
            ),
        );
        trainings?.forEach(
          async (training) =>
            await this.trainingRepository.addUsersToTraining(
              training.id,
              addedUsers,
            ),
        );
      }
    }

    if (deletedUsers && addRelatives) {
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
  }
}
