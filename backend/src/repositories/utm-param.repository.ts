import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { UtmParamResponse } from 'src/public/utm-param/dto/utm-param-response.dto';

export interface UtmParamFilter {
  page: number;
  per_page: number;
}

@Injectable()
export class UtmParamRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UtmParamUncheckedCreateInput) {
    return await this.prisma.utmParam.create({ data });
  }

  async find(condition: Prisma.UtmParamWhereInput) {
    return await this.prisma.utmParam.findFirst({
      where: condition,
    });
  }

  async findAll(options: UtmParamFilter) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<UtmParamResponse, Prisma.UtmParamFindManyArgs>(
      this.prisma.utmParam,
      {
        where: {},
        orderBy: { createdAt: 'asc' },
      },
      {
        page: options.page,
      },
    );
  }
}
