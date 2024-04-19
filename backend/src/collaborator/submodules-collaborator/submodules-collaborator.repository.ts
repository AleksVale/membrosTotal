import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmoduleCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, moduleId?: number) {
    return this.prisma.submodule.findMany({
      where: {
        moduleId: moduleId,
        PermissionUserSubModule: {
          some: {
            User: {
              id: user.id,
            },
          },
        },
      },
    });
  }
}
