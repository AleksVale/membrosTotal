import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { SubModule } from '../../../domain/training/entities/sub-module.entity';
import {
  CreateSubModuleData,
  SubModuleRepositoryInterface,
} from '../../../domain/training/repositories/sub-module.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SubModuleRepository implements SubModuleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubModuleData): Promise<SubModule> {
    const prismaSubModule = await this.prisma.subModule.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        moduleId: data.moduleId,
      },
    });

    return this.toDomainEntity(prismaSubModule);
  }

  async findById(id: string): Promise<SubModule | null> {
    const prismaSubModule = await this.prisma.subModule.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prismaSubModule) {
      return null;
    }

    return this.toDomainEntity(prismaSubModule);
  }

  async findByModuleId(moduleId: string): Promise<SubModule[]> {
    const prismaSubModules = await this.prisma.subModule.findMany({
      where: { moduleId, deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return prismaSubModules.map((sm) => this.toDomainEntity(sm));
  }

  async update(id: string, subModule: SubModule): Promise<SubModule> {
    const prismaSubModule = await this.prisma.subModule.update({
      where: { id },
      data: {
        title: subModule.title,
        description: subModule.description,
        order: subModule.order,
      },
    });

    return this.toDomainEntity(prismaSubModule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subModule.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.subModule.update({
        where: { id },
        data: { deletedAt: now },
      });

      await tx.lesson.updateMany({
        where: { subModuleId: id, deletedAt: null },
        data: { deletedAt: now },
      });
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.subModule.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async existsByOrderAndModuleId(
    order: number,
    moduleId: string,
  ): Promise<boolean> {
    const count = await this.prisma.subModule.count({
      where: {
        order,
        moduleId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  private toDomainEntity(
    prismaSubModule: Prisma.SubModuleGetPayload<Record<string, never>>,
  ): SubModule {
    return new SubModule(
      prismaSubModule.id,
      prismaSubModule.title,
      prismaSubModule.description,
      prismaSubModule.order,
      prismaSubModule.moduleId,
      prismaSubModule.deletedAt,
      prismaSubModule.createdAt,
      prismaSubModule.updatedAt,
    );
  }
}
