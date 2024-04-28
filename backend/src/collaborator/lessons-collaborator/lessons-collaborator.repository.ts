import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, submoduleId?: number) {
    return this.prisma.lesson.findMany({
      where: {
        submoduleId: submoduleId,
      },
      include: {
        UserViewLesson: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async viewLesson(user: TokenPayload, lessonId: number) {
    return this.prisma.userViewLesson.create({
      data: {
        userId: user.id,
        lessonId: lessonId,
      },
    });
  }
}
