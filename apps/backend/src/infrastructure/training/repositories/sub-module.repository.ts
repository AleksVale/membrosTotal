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

  async reorder(id: string, newOrder: number): Promise<SubModule> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.subModule.findFirst({
        where: { id, deletedAt: null },
      });

      if (!item) {
        throw new Error(`SubModule with id "${id}" not found`);
      }

      const allItems = await tx.subModule.findMany({
        where: { moduleId: item.moduleId, deletedAt: null },
        orderBy: { order: 'asc' },
      });

      const currentIndex = allItems.findIndex((sm) => sm.id === id);
      if (currentIndex === -1) {
        throw new Error(`SubModule with id "${id}" not found`);
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
        await tx.subModule.update({
          where: { id: reorderedItems[i].id },
          data: { order: i + 1 },
        });
      }

      const updated = await tx.subModule.findUnique({
        where: { id },
      });

      if (!updated) {
        throw new Error(`SubModule with id "${id}" not found`);
      }

      return this.toDomainEntity(updated);
    });
  }

  async swapOrders(id1: string, id2: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item1 = await tx.subModule.findFirst({
        where: { id: id1, deletedAt: null },
      });
      const item2 = await tx.subModule.findFirst({
        where: { id: id2, deletedAt: null },
      });

      if (!item1) {
        throw new Error(`SubModule with id "${id1}" not found`);
      }
      if (!item2) {
        throw new Error(`SubModule with id "${id2}" not found`);
      }

      if (item1.moduleId !== item2.moduleId) {
        throw new Error(
          `SubModules must belong to the same module. SubModule ${id1} belongs to module ${item1.moduleId}, subModule ${id2} belongs to module ${item2.moduleId}`,
        );
      }

      const tempOrder = item1.order;
      await tx.subModule.update({
        where: { id: id1 },
        data: { order: item2.order },
      });
      await tx.subModule.update({
        where: { id: id2 },
        data: { order: tempOrder },
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
