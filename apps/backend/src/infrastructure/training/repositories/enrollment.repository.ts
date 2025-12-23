import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Enrollment } from '../../../domain/training/entities/enrollment.entity';
import {
  CreateEnrollmentData,
  EnrollmentRepositoryInterface,
} from '../../../domain/training/repositories/enrollment.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EnrollmentRepository implements EnrollmentRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEnrollmentData): Promise<Enrollment> {
    const prismaEnrollment = await this.prisma.enrollment.create({
      data: {
        userId: data.userId,
        trainingId: data.trainingId,
        enrolledAt: data.enrolledAt,
      },
    });

    return this.toDomainEntity(prismaEnrollment);
  }

  async findById(id: string): Promise<Enrollment | null> {
    const prismaEnrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!prismaEnrollment) {
      return null;
    }

    return this.toDomainEntity(prismaEnrollment);
  }

  async findByUserAndTraining(
    userId: string,
    trainingId: string,
  ): Promise<Enrollment | null> {
    const prismaEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_trainingId: {
          userId,
          trainingId,
        },
      },
    });

    if (!prismaEnrollment) {
      return null;
    }

    return this.toDomainEntity(prismaEnrollment);
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    const prismaEnrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
    });

    return prismaEnrollments.map((e) => this.toDomainEntity(e));
  }

  async findByTrainingId(trainingId: string): Promise<Enrollment[]> {
    const prismaEnrollments = await this.prisma.enrollment.findMany({
      where: { trainingId },
      orderBy: { enrolledAt: 'desc' },
    });

    return prismaEnrollments.map((e) => this.toDomainEntity(e));
  }

  async exists(userId: string, trainingId: string): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: {
        userId,
        trainingId,
      },
    });
    return count > 0;
  }

  async findAll(): Promise<Enrollment[]> {
    const prismaEnrollments = await this.prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
    });

    return prismaEnrollments.map((e) => this.toDomainEntity(e));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.enrollment.delete({
      where: { id },
    });
  }

  async deleteByUserAndTraining(
    userId: string,
    trainingId: string,
  ): Promise<void> {
    await this.prisma.enrollment.deleteMany({
      where: {
        userId,
        trainingId,
      },
    });
  }

  async bulkCreate(data: CreateEnrollmentData[]): Promise<Enrollment[]> {
    return await this.prisma.$transaction(async (tx) => {
      const created = await Promise.all(
        data.map((item) =>
          tx.enrollment.create({
            data: {
              userId: item.userId,
              trainingId: item.trainingId,
              enrolledAt: item.enrolledAt,
            },
          }),
        ),
      );

      return created.map((e) => this.toDomainEntity(e));
    });
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.enrollment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  private toDomainEntity(
    prismaEnrollment: Prisma.EnrollmentGetPayload<Record<string, never>>,
  ): Enrollment {
    return new Enrollment(
      prismaEnrollment.id,
      prismaEnrollment.userId,
      prismaEnrollment.trainingId,
      prismaEnrollment.enrolledAt,
    );
  }
}
