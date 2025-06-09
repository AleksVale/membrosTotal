import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonResponseDTO } from './dto/lessons-response.dto';
import { LessonQuery } from './lessons-admin.service';

@Injectable()
export class LessonsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LessonUncheckedCreateInput) {
    return await this.prisma.lesson.create({ data });
  }

  async find(condition: Prisma.LessonWhereInput) {
    return await this.prisma.lesson.findFirst({
      where: condition,
      include: {
        submodule: {
          include: {
            module: {
              include: {
                training: true,
              },
            },
          },
        },
      },
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

  async findAll(options: LessonQuery) {
    const paginate = createPaginator({ perPage: options.per_page });

    return paginate<LessonResponseDTO, Prisma.LessonFindManyArgs>(
      this.prisma.lesson,
      {
        where: {
          title: {
            contains: options.title,
          },
          submoduleId: options.subModuleId,
        },
        include: {
          submodule: {
            include: {
              module: {
                include: {
                  training: true,
                },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      {
        page: options.page,
      },
    );
  }

  async remove(condition: Prisma.LessonWhereUniqueInput) {
    return await this.prisma.lesson.delete({
      where: condition,
    });
  }
}
