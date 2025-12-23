import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Module } from '../../../domain/training/entities/module.entity';
import {
    CreateModuleData,
    ModuleRepositoryInterface,
} from '../../../domain/training/repositories/module.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ModuleRepository implements ModuleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateModuleData): Promise<Module> {
    const prismaModule = await this.prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        trainingId: data.trainingId,
      },
    });

    return this.toDomainEntity(prismaModule);
  }

  async findById(id: string): Promise<Module | null> {
    const prismaModule = await this.prisma.module.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prismaModule) {
      return null;
    }

    return this.toDomainEntity(prismaModule);
  }

  async findByTrainingId(trainingId: string): Promise<Module[]> {
    const prismaModules = await this.prisma.module.findMany({
      where: { trainingId, deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return prismaModules.map((m) => this.toDomainEntity(m));
  }

  async update(id: string, module: Module): Promise<Module> {
    const prismaModule = await this.prisma.module.update({
      where: { id },
      data: {
        title: module.title,
        description: module.description,
        order: module.order,
      },
    });

    return this.toDomainEntity(prismaModule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.module.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.module.update({
        where: { id },
        data: { deletedAt: now },
      });

      const subModules = await tx.subModule.findMany({
        where: { moduleId: id, deletedAt: null },
      });

      for (const subModule of subModules) {
        await tx.subModule.update({
          where: { id: subModule.id },
          data: { deletedAt: now },
        });

        await tx.lesson.updateMany({
          where: { subModuleId: subModule.id, deletedAt: null },
          data: { deletedAt: now },
        });
      }
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.module.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async existsByOrderAndTrainingId(
    order: number,
    trainingId: string,
  ): Promise<boolean> {
    const count = await this.prisma.module.count({
      where: {
        order,
        trainingId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  private toDomainEntity(
    prismaModule: Prisma.ModuleGetPayload<Record<string, never>>,
  ): Module {
    return new Module(
      prismaModule.id,
      prismaModule.title,
      prismaModule.description,
      prismaModule.order,
      prismaModule.trainingId,
      prismaModule.deletedAt,
      prismaModule.createdAt,
      prismaModule.updatedAt,
    );
  }
}
