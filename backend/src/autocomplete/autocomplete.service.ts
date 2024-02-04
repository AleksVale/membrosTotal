import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AutocompleteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(fields?: string) {
    if (!fields) return [];
    const prismaExtended = this.prisma.$extends({
      name: 'name',
      result: {
        user: {
          fullName: {
            needs: { firstName: true, lastName: true },
            compute(user) {
              return `${user.firstName} ${user.lastName}`;
            },
          },
        },
      },
    });
    const response: any = {};

    const fieldsArray = fields.split(',');
    for (const field of fieldsArray) {
      switch (field) {
        case 'profiles':
          response.profiles = await this.prisma.profile.findMany({
            select: {
              id: true,
              name: true,
              label: true,
            },
          });
          break;
        case 'users':
          response.users = await prismaExtended.user.findMany({
            select: {
              id: true,
              fullName: true,
            },
          });
          break;
        default:
          break;
      }
    }
    return response;
  }
}
