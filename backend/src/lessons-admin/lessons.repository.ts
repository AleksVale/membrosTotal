import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class LessonsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LessonUncheckedCreateInput) {
    return await this.prisma.lesson.create({ data });
  }

  async find(condition: Prisma.LessonWhereInput) {
    return await this.prisma.lesson.findFirst({
      where: condition,
    });
  }

  async update(
    lesson: Prisma.LessonUpdateInput,
    where: Prisma.LessonWhereUniqueInput,
  ) {
    return await this.prisma.lesson.update({
      data: lesson,
      where: where,
    });
  }

  async findAll(options: any) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<any, Prisma.LessonFindManyArgs>(
      this.prisma.lesson,
      {
        where: {
          title: {
            contains: options.title,
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      {
        page: options.page,
      },
    );
  }
}
