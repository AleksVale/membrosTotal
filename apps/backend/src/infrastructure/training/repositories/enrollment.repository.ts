import { Injectable } from '@nestjs/common';
import { Enrollment } from '../../../domain/training/entities/enrollment.entity';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EnrollmentRepository implements EnrollmentRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const prismaEnrollment = await (this.prisma as any).enrollment.create({
      data: {
        id: enrollment.id,
        userId: enrollment.userId,
        trainingId: enrollment.trainingId,
        enrolledAt: enrollment.enrolledAt,
      },
    });

    return this.toDomainEntity(prismaEnrollment);
  }

  async findById(id: string): Promise<Enrollment | null> {
    const prismaEnrollment = await (this.prisma as any).enrollment.findUnique({
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
    const prismaEnrollment = await (this.prisma as any).enrollment.findUnique({
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
    const prismaEnrollments = await (this.prisma as any).enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
    });

    return prismaEnrollments.map((e: any) => this.toDomainEntity(e));
  }

  async findByTrainingId(trainingId: string): Promise<Enrollment[]> {
    const prismaEnrollments = await (this.prisma as any).enrollment.findMany({
      where: { trainingId },
      orderBy: { enrolledAt: 'desc' },
    });

    return prismaEnrollments.map((e: any) => this.toDomainEntity(e));
  }

  async exists(userId: string, trainingId: string): Promise<boolean> {
    const count = await (this.prisma as any).enrollment.count({
      where: {
        userId,
        trainingId,
      },
    });
    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await (this.prisma as any).enrollment.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaEnrollment: {
    id: string;
    userId: string;
    trainingId: string;
    enrolledAt: Date;
  }): Enrollment {
    return new Enrollment(
      prismaEnrollment.id,
      prismaEnrollment.userId,
      prismaEnrollment.trainingId,
      prismaEnrollment.enrolledAt,
    );
  }
}
