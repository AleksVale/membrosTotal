import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class ModuleCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, trainingId?: number) {
    console.log(`[DEBUG] Searching modules for user ID: ${user.id}, trainingId: ${trainingId}`);
    
    // Primeiro, vamos verificar se o usuário tem permissões para módulos
    const permissions = await this.prisma.permissionUserModule.findMany({
      where: {
        userId: user.id,
        ...(trainingId && { Module: { trainingId } }),
      },
      include: {
        Module: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            order: true,
            trainingId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    
    console.log(`[DEBUG] User module permissions:`, permissions);
    
    // Vamos usar os dados das permissões diretamente
    const result = permissions.map(permission => permission.Module);
    
    // Ordenar por ordem
    result.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`[DEBUG] Found ${result.length} modules for user ${user.id}:`, result);
    
    return result;
  }
}
