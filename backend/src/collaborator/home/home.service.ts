import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { MeetingRepository } from 'src/admin/meetings/meeting.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly meetingsRepository: MeetingRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getInitialData(currentUser: TokenPayload) {
    const meetings = await this.meetingsRepository.findHomeMeetings(
      currentUser.id,
    );
    const notifications =
      await this.notificationRepository.findHomeNotifications(currentUser.id);
    return { meetings, notifications };
  }

  async getDashboardStats(currentUser: TokenPayload) {
    const userId = currentUser.id;

    // Estatísticas de solicitações de pagamento
    const [pendingPaymentRequests, totalPaymentRequests, approvedPayments] = await Promise.all([
      this.prisma.paymentRequest.count({
        where: {
          userId,
          status: PaymentStatus.PENDING,
        },
      }),
      this.prisma.paymentRequest.count({
        where: { userId },
      }),
      this.prisma.paymentRequest.count({
        where: {
          userId,
          status: PaymentStatus.APPROVED,
        },
      }),
    ]);

    // Estatísticas de treinamentos (usando campos disponíveis)
    const totalTrainings = await this.prisma.permissionUserTraining.count({
      where: { userId },
    });

    // Como não há campo completedAt, vamos considerar todos como em progresso por agora
    const completedTrainings = 0; // Pode ser implementado com lógica de negócio específica
    const inProgressTrainings = totalTrainings;

    // Estatísticas de reuniões
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [upcomingMeetings, thisMonthMeetings, totalMeetings] = await Promise.all([
      this.prisma.userMeeting.count({
        where: {
          userId,
          Meeting: {
            date: { gte: now },
          },
        },
      }),
      this.prisma.userMeeting.count({
        where: {
          userId,
          Meeting: {
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      }),
      this.prisma.userMeeting.count({
        where: { userId },
      }),
    ]);

    // Estatísticas de módulos (usando campos disponíveis)
    const totalModules = await this.prisma.permissionUserModule.count({
      where: { userId },
    });

    // Como não há campo completedAt nos módulos, consideramos todos como em progresso
    const completedModules = 0; // Pode ser implementado com lógica específica

    // Estatísticas de aulas visualizadas
    const totalLessons = await this.prisma.userViewLesson.count({
      where: { userId },
    });

    // Como não há campo completed nas aulas, consideramos todas as visualizadas como completas
    const completedLessons = totalLessons;

    // Total de pagamentos recebidos (usando campo value ao invés de amount)
    const totalEarnings = await this.prisma.paymentRequest.aggregate({
      where: {
        userId,
        status: PaymentStatus.APPROVED,
      },
      _sum: {
        value: true,
      },
    });

    // Notificações não lidas
    const unreadNotifications = await this.prisma.notificationUser.count({
      where: {
        userId,
        read: false,
      },
    });

    return {
      paymentRequests: {
        pending: pendingPaymentRequests,
        total: totalPaymentRequests,
        approved: approvedPayments,
        rejectedPercentage: totalPaymentRequests > 0 ? 
          Math.round(((totalPaymentRequests - approvedPayments - pendingPaymentRequests) / totalPaymentRequests) * 100) : 0,
      },
      trainings: {
        total: totalTrainings,
        completed: completedTrainings,
        inProgress: inProgressTrainings,
        completionRate: totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0,
      },
      meetings: {
        upcoming: upcomingMeetings,
        thisMonth: thisMonthMeetings,
        total: totalMeetings,
      },
      modules: {
        total: totalModules,
        completed: completedModules,
        completionRate: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      },
      lessons: {
        total: totalLessons,
        completed: completedLessons,
        completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
      financials: {
        totalEarnings: totalEarnings._sum.value || 0,
        pendingAmount: await this.getTotalPendingAmount(userId),
      },
      notifications: {
        unread: unreadNotifications,
      },
    };
  }

  private async getTotalPendingAmount(userId: number): Promise<number> {
    const result = await this.prisma.paymentRequest.aggregate({
      where: {
        userId,
        status: PaymentStatus.PENDING,
      },
      _sum: {
        value: true,
      },
    });
    return result._sum.value || 0;
  }
}
