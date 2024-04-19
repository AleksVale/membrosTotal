import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrainingCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload) {
    return this.prisma.training
      .findMany
      //   {
      //   where: {
      //     PermissionUserTraining: {
      //       some: {
      //         User: {
      //           id: user.id,
      //         },
      //       },
      //     },
      //   },
      // }
      ();
  }
}
