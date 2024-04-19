import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpertRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ExpertRequestUncheckedCreateInput) {
    return await this.prisma.expertRequest.create({ data });
  }
}
