import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from 'src/profile/profile.entity';

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
          console.log(`[DEBUG] Fetching users for autocomplete`);
          response.users = await this.prisma.user.findMany({
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
            where: {
              status: 'ACTIVE', // Only fetch active users
            },
          });
          console.log(`[DEBUG] Users found:`, response.users);
          break;
        case 'paymentTypes':
          response.paymentTypes = await this.prisma.paymentType.findMany({
            select: {
              id: true,
              label: true,
            },
          });
          break;
        case 'paymentRequest':
          response.paymentRequest =
            await this.prisma.paymentRequestType.findMany({
              select: {
                id: true,
                label: true,
              },
            });
          break;
        case 'refundTypes':
          response.refundTypes = await this.prisma.refundType.findMany({
            select: {
              id: true,
              label: true,
            },
          });
          break;
        case 'experts':
          response.experts = await prismaExtended.user.findMany({
            select: {
              id: true,
              fullName: true,
            },
            where: {
              Profile: {
                name: Profile.EXPERT,
              },
            },
          });
          break;
        case 'trainings':
          response.trainings = (
            await this.prisma.training.findMany({
              select: {
                id: true,
                title: true,
              },
            })
          ).map((value) => ({
            id: value.id,
            label: value.title,
          }));
          break;
        case 'modules':
          response.modules = (
            await this.prisma.module.findMany({
              select: {
                id: true,
                title: true,
              },
            })
          ).map((value) => ({
            id: value.id,
            label: value.title,
          }));
          break;
        case 'submodules':
          response.submodules = (
            await this.prisma.submodule.findMany({
              select: {
                id: true,
                title: true,
              },
            })
          ).map((value) => ({
            id: value.id,
            label: value.title,
          }));
          break;
        default:
          break;
      }
    }
    return response;
  }
}
