import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class SubmoduleCollaboratorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(user: TokenPayload, moduleId?: number) {
    console.log(`[DEBUG] Searching submodules for user ID: ${user.id}, moduleId: ${moduleId}`);
    
    // Primeiro, vamos verificar se o usuário tem permissões para submódulos
    const permissions = await this.prisma.permissionUserSubModule.findMany({
      where: {
        userId: user.id,
        ...(moduleId && { Submodule: { moduleId } }),
      },
      include: {
        Submodule: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            order: true,
            moduleId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    
    console.log(`[DEBUG] User submodule permissions:`, permissions);
    
    // Vamos usar os dados das permissões diretamente
    const result = permissions.map(permission => permission.Submodule);
    
    // Ordenar por ordem
    result.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`[DEBUG] Found ${result.length} submodules for user ${user.id}:`, result);
    
    return result;
  }
}
