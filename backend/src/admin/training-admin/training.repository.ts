import { Injectable } from '@nestjs/common';
import { Prisma, TrainingStatus } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrainingDTO } from './dto/training-response.dto';
import {
  TrainingDetailStatsDto,
  TrainingStatsDto,
} from './dto/training-stats.dto';
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
        orderBy: { order: 'asc' },
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

  async countUsers() {
    return await this.prisma.user.count({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  async countTrainings() {
    return await this.prisma.training.count();
  }

  async countActivePermissions() {
    // Count all permissions across all entities
    const [trainingPermissions, modulePermissions, submodulePermissions] = await Promise.all([
      this.prisma.permissionUserTraining.count(),
      this.prisma.permissionUserModule.count(),
      this.prisma.permissionUserSubModule.count(),
    ]);
    
    return trainingPermissions + modulePermissions + submodulePermissions;
  }

  async countRecentPermissionChanges() {
    // Get permissions created or updated in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const [recentTrainingPermissions, recentModulePermissions, recentSubmodulePermissions] = await Promise.all([
      this.prisma.permissionUserTraining.count({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
      }),
      this.prisma.permissionUserModule.count({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
      }),
      this.prisma.permissionUserSubModule.count({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
      }),
    ]);
    
    return recentTrainingPermissions + recentModulePermissions + recentSubmodulePermissions;
  }

  async getUsersWithPermission(trainingId: number) {
    const permissions = await this.prisma.permissionUserTraining.findMany({
      where: {
        trainingId,
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

  async getGlobalStats(): Promise<TrainingStatsDto> {
    const [total, activeCount, draftCount, archivedCount] = await Promise.all([
      this.prisma.training.count(),
      this.prisma.training.count({
        where: { status: TrainingStatus.ACTIVE },
      }),
      this.prisma.training.count({
        where: { status: TrainingStatus.DRAFT },
      }),
      this.prisma.training.count({
        where: { status: TrainingStatus.ARCHIVED },
      }),
    ]);

    // Usar groupBy para contar usuários distintos
    const distinctUsers = await this.prisma.permissionUserTraining.groupBy({
      by: ['userId'],
      _count: {
        userId: true, // Conta quantos registros existem para cada userId
      },
    });

    const studentsCount = distinctUsers.length;

    return {
      total,
      active: activeCount,
      draft: draftCount,
      archived: archivedCount,
      students: studentsCount,
    };
  }

  async getTrainingStats(id: number): Promise<TrainingDetailStatsDto> {
    // Verificar se o treinamento existe
    const training = await this.prisma.training.findUnique({
      where: { id },
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
    });

    if (!training) {
      throw new Error(`Training with ID ${id} not found`);
    }

    // Contar módulos
    const moduleCount = training.Module.length;

    // Contar alunos matriculados
    const studentsCount = training.PermissionUserTraining.length;

    // Para implementar completions e outras estatísticas mais avançadas,
    // você precisaria de uma tabela que registre o progresso/conclusão dos alunos
    // Aqui estou usando valores mockados, mas você deve adaptar para sua estrutura real
    const completionsCount = 0; // Substitua pela lógica real
    const completionRate =
      studentsCount > 0 ? (completionsCount / studentsCount) * 100 : 0;

    return {
      modules: moduleCount,
      students: studentsCount,
      completions: completionsCount,
      completionRate: completionRate,
      averageCompletionTime: 0, // Implemente conforme necessário
    };
  }
}
