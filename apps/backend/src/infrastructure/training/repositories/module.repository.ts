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
    const prismaModule = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!prismaModule) {
      return null;
    }

    return this.toDomainEntity(prismaModule);
  }

  async findByTrainingId(trainingId: string): Promise<Module[]> {
    const prismaModules = await this.prisma.module.findMany({
      where: { trainingId },
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

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.module.count({
      where: { id },
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
      prismaModule.createdAt,
      prismaModule.updatedAt,
    );
  }
}
