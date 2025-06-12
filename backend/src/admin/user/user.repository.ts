import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserFilter } from './user.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async find(condition: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({
      where: condition,
      include: {
        Profile: true,
      },
    });
  }

  async update(
    user: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ) {
    return await this.prisma.user.update({
      data: user,
      where: where,
    });
  }

  async findAll(options: UserFilter) {
    const paginate = createPaginator({ perPage: options.per_page });
    let userIds: number[] | undefined = undefined;
    if (options.name) {
      const ids = await this.prisma.$queryRaw<{ id: number }[]>`
    SELECT id
    FROM users
    WHERE CONCAT(first_name, ' ', last_name) LIKE ${`%${options.name}%`}
  `;
      userIds = ids.map((user) => user.id);
    }

    const users = await paginate<UserResponseDTO, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          id: { in: userIds },
          email: { contains: options.email },
          profileId: options.profile ? parseInt(options.profile) : undefined,
        },
        orderBy: { email: 'asc' },
        include: {
          Profile: true,
          UserMeeting: true,
          _count: {
            select: {
              PermissionUserTraining: true,
              PermissionUserModule: true,
              PermissionUserSubModule: true,
            }
          }
        },
      },
      {
        page: options.page,
      },
    );
    
    // Transform the count fields to the expected format
    const transformedData = {
      ...users,
      data: users.data.map(user => {
        // First extract the raw Prisma count data
        const countData = user._count as unknown as { 
          PermissionUserTraining: number; 
          PermissionUserModule: number; 
          PermissionUserSubModule: number;
        };
        
        return {
          ...user,
          _count: {
            trainingPermissions: countData?.PermissionUserTraining || 0,
            modulePermissions: countData?.PermissionUserModule || 0,
            submodulePermissions: countData?.PermissionUserSubModule || 0,
          }
        };
      })
    };
    
    return transformedData;
  }
  
  async getUserPermissions(userId: number) {
    // Get trainings the user has access to
    const trainingPermissions = await this.prisma.permissionUserTraining.findMany({
      where: { userId },
      select: {
        Training: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    // Get modules the user has access to
    const modulePermissions = await this.prisma.permissionUserModule.findMany({
      where: { userId },
      select: {
        Module: {
          select: {
            id: true,
            title: true,
            training: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Get submodules the user has access to
    const submodulePermissions = await this.prisma.permissionUserSubModule.findMany({
      where: { userId },
      select: {
        Submodule: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                id: true,
                title: true,
                training: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Format and return data
    return {
      trainings: trainingPermissions.map(perm => perm.Training),
      modules: modulePermissions.map(perm => perm.Module),
      submodules: submodulePermissions.map(perm => perm.Submodule),
    };
  }
}
