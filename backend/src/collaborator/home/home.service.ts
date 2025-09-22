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

  async getMonthlyProgressData(currentUser: TokenPayload) {
    const userId = currentUser.id;
    const now = new Date();
    const months: Array<{
      name: string;
      trainings: number;
      modules: number;
      lessons: number;
      meetings: number;
      total: number;
    }> = [];
    
    // Obter dados dos últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Contar atividades do mês
      const [trainingsStarted, modulesAccessed, lessonsViewed, meetingsAttended] = await Promise.all([
        this.prisma.permissionUserTraining.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
        this.prisma.permissionUserModule.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
        this.prisma.userViewLesson.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
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
      ]);
      
      months.push({
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        trainings: trainingsStarted,
        modules: modulesAccessed,
        lessons: lessonsViewed,
        meetings: meetingsAttended,
        total: trainingsStarted + modulesAccessed + lessonsViewed + meetingsAttended,
      });
    }
    
    return months;
  }

    async getRecentActivities(currentUser: TokenPayload) {
    const userId = currentUser.id;
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: Date;
      status: string;
      href: string;
    }> = [];
    
    // Buscar últimas solicitações de pagamento
    const recentPayments = await this.prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        description: true,
        status: true,
        value: true,
        createdAt: true,
      },
    });

    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: 'Solicitação de Pagamento',
        description: payment.description || `Valor: R$ ${payment.value || 0}`,
        timestamp: payment.createdAt,
        status: payment.status.toLowerCase(),
        href: '/collaborator/payment-requests',
      });
    });

    // Buscar últimas reuniões
    const recentMeetings = await this.prisma.userMeeting.findMany({
      where: { userId },
      orderBy: { Meeting: { date: 'desc' } },
      take: 2,
      include: {
        Meeting: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
          },
        },
      },
    });

    recentMeetings.forEach(userMeeting => {
      activities.push({
        id: `meeting-${userMeeting.Meeting.id}`,
        type: 'meeting',
        title: userMeeting.Meeting.title,
        description: userMeeting.Meeting.description || 'Reunião agendada',
        timestamp: userMeeting.Meeting.date,
        status: new Date(userMeeting.Meeting.date) < new Date() ? 'completed' : 'pending',
        href: '/collaborator/meetings',
      });
    });

    // Buscar últimas aulas visualizadas
    const recentLessons = await this.prisma.userViewLesson.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: {
        Lesson: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    recentLessons.forEach(userLesson => {
      activities.push({
        id: `lesson-${userLesson.Lesson.id}`,
        type: 'module',
        title: userLesson.Lesson.title,
        description: userLesson.Lesson.description || 'Aula visualizada',
        timestamp: userLesson.createdAt,
        status: 'completed',
        href: '/collaborator/lessons',
      });
    });

    // Ordenar por timestamp mais recente
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, 5); // Retornar apenas os 5 mais recentes
  }

  async getWeeklyProgress(currentUser: TokenPayload) {
    const userId = currentUser.id;
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1); // Começar na segunda-feira
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData: Array<{
      day: string;
      shortDay: string;
      completed: number;
      total: number;
      isToday: boolean;
      activities: {
        lessons: number;
        meetings: number;
        payments: number;
      };
    }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const isToday = date.toDateString() === today.toDateString();

      // Contar atividades do dia
      const [lessonsViewed, meetingsAttended, paymentsRequested] = await Promise.all([
        this.prisma.userViewLesson.count({
          where: {
            userId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.userMeeting.count({
          where: {
            userId,
            Meeting: {
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        }),
        this.prisma.paymentRequest.count({
          where: {
            userId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
      ]);

      const completed = lessonsViewed + meetingsAttended + paymentsRequested;
      const total = 5; // Meta diária de atividades

      weekData.push({
        day: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
        shortDay: date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
        completed,
        total,
        isToday,
        activities: {
          lessons: lessonsViewed,
          meetings: meetingsAttended,
          payments: paymentsRequested,
        },
      });
    }

    return weekData;
  }
}
