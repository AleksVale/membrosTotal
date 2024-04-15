import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, submoduleId?: number) {
    return this.prisma.lesson.findMany({
      where: {
        submoduleId: submoduleId,
      },
    });
  }
}
