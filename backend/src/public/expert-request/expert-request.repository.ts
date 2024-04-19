import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { ExpertResponseDto } from 'src/admin/expert-request/dto/get-expert-request.dto';

@Injectable()
export class ExpertRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ExpertRequestUncheckedCreateInput) {
    return await this.prisma.expertRequest.create({ data });
  }

  async findAll({ page, per_page }: { page: number; per_page: number }) {
    const paginate = createPaginator({ perPage: per_page });

    return paginate<ExpertResponseDto, Prisma.UserFindManyArgs>(
      this.prisma.expertRequest,
      {
        orderBy: { createdAt: 'asc' },
      },
      {
        page: page,
      },
    );
  }
}
