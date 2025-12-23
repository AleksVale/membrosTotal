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
    const prismaSubModule = await this.prisma.subModule.findUnique({
      where: { id },
    });

    if (!prismaSubModule) {
      return null;
    }

    return this.toDomainEntity(prismaSubModule);
  }

  async findByModuleId(moduleId: string): Promise<SubModule[]> {
    const prismaSubModules = await this.prisma.subModule.findMany({
      where: { moduleId },
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

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.subModule.count({
      where: { id },
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
      prismaSubModule.createdAt,
      prismaSubModule.updatedAt,
    );
  }
}
