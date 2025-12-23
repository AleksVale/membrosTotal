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

  async reorder(id: string, newOrder: number): Promise<Module> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.module.findFirst({
        where: { id, deletedAt: null },
      });

      if (!item) {
        throw new Error(`Module with id "${id}" not found`);
      }

      const allItems = await tx.module.findMany({
        where: { trainingId: item.trainingId, deletedAt: null },
        orderBy: { order: 'asc' },
      });

      const currentIndex = allItems.findIndex((m) => m.id === id);
      if (currentIndex === -1) {
        throw new Error(`Module with id "${id}" not found`);
      }

      if (newOrder < 1 || newOrder > allItems.length) {
        throw new Error(
          `Invalid order position: ${newOrder}. Must be between 1 and ${allItems.length}`,
        );
      }

      const targetIndex = newOrder - 1;

      if (currentIndex === targetIndex) {
        return this.toDomainEntity(item);
      }

      const reorderedItems = [...allItems];
      const [movedItem] = reorderedItems.splice(currentIndex, 1);
      reorderedItems.splice(targetIndex, 0, movedItem);

      for (let i = 0; i < reorderedItems.length; i++) {
        await tx.module.update({
          where: { id: reorderedItems[i].id },
          data: { order: i + 1 },
        });
      }

      const updated = await tx.module.findUnique({
        where: { id },
      });

      if (!updated) {
        throw new Error(`Module with id "${id}" not found`);
      }

      return this.toDomainEntity(updated);
    });
  }

  async swapOrders(id1: string, id2: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item1 = await tx.module.findFirst({
        where: { id: id1, deletedAt: null },
      });
      const item2 = await tx.module.findFirst({
        where: { id: id2, deletedAt: null },
      });

      if (!item1) {
        throw new Error(`Module with id "${id1}" not found`);
      }
      if (!item2) {
        throw new Error(`Module with id "${id2}" not found`);
      }

      if (item1.trainingId !== item2.trainingId) {
        throw new Error(
          `Modules must belong to the same training. Module ${id1} belongs to training ${item1.trainingId}, module ${id2} belongs to training ${item2.trainingId}`,
        );
      }

      const tempOrder = item1.order;
      await tx.module.update({
        where: { id: id1 },
        data: { order: item2.order },
      });
      await tx.module.update({
        where: { id: id2 },
        data: { order: tempOrder },
      });
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
