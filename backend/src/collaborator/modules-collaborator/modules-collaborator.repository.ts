import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModuleCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, trainingId?: number) {
    return this.prisma.module.findMany({
      where: {
        trainingId: trainingId,
        // PermissionUserModule: {
        //   some: {
        //     User: {
        //       id: user.id,
        //     },
        //   },
        // },
      },
    });
  }
}
