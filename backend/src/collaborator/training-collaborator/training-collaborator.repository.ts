import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class TrainingCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload) {
    console.log(`[DEBUG] Searching trainings for user ID: ${user.id}`);
    
    // Primeiro, vamos verificar se o usuário tem permissões
    const permissions = await this.prisma.permissionUserTraining.findMany({
      where: {
        userId: user.id,
      },
      include: {
        Training: {
          select: {
            id: true,
            title: true,
            description: true,
            tutor: true,
            thumbnail: true,
            order: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    
    console.log(`[DEBUG] User permissions:`, permissions);
    
    // Vamos usar os dados das permissões diretamente
    const result = permissions.map(permission => permission.Training);
    
    // Ordenar por ordem
    result.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`[DEBUG] Found ${result.length} trainings for user ${user.id}:`, result);
    
    return result;
  }
}
