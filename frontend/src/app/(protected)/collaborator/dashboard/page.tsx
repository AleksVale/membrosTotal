"use client";

import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  paymentRequests: {
    pending: number;
    total: number;
    approved: number;
    rejectedPercentage: number;
  };
  trainings: {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  };
  meetings: {
    upcoming: number;
    thisMonth: number;
    total: number;
  };
  modules: {
    total: number;
    completed: number;
    completionRate: number;
  };
  lessons: {
    total: number;
    completed: number;
    completionRate: number;
  };
  financials: {
    totalEarnings: number;
    pendingAmount: number;
  };
  notifications: {
    unread: number;
  };
}

export default function CollaboratorDashboardPage() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery<DashboardStats>({
    queryKey: QueryKeys.collaborator.dashboard,
    queryFn: async () => {
      const response = await http.get("/collaborator/home/stats");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // 10 minutos
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar os dados do dashboard. Tente novamente.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const chartData = [
    { name: "Treinamentos", value: stats?.trainings.completed || 0 },
    { name: "Módulos", value: stats?.modules.completed || 0 },
    { name: "Aulas", value: stats?.lessons.completed || 0 },
    { name: "Reuniões", value: stats?.meetings.thisMonth || 0 },
  ];

  const progressData = [
    { name: "Jan", value: 12 },
    { name: "Fev", value: 19 },
    { name: "Mar", value: 15 },
    { name: "Abr", value: 25 },
    { name: "Mai", value: 22 },
    { name: "Jun", value: 30 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeHeader
        stats={{
          completionRate: stats?.trainings.completionRate || 0,
          streak: 5, // Dados simulados - pode ser integrado com API futuramente
          todayTasks: 3,
        }}
      />

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Resumo das Atividades</h2>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e métricas em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="learning">Aprendizado</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Pagamentos Pendentes"
              value={stats?.paymentRequests.pending || 0}
              description="Solicitações aguardando aprovação"
              icon={<DollarSign className="h-4 w-4" />}
              href="/collaborator/payment-requests"
              badge={{
                text: formatCurrency(stats?.financials.pendingAmount || 0),
                variant: "secondary",
              }}
            />

            <StatCard
              title="Treinamentos Ativos"
              value={stats?.trainings.inProgress || 0}
              description="Cursos em andamento"
              icon={<BookOpen className="h-4 w-4" />}
              href="/collaborator/trainings"
              progress={{
                value: stats?.trainings.completed || 0,
                max: stats?.trainings.total || 1,
                label: "Taxa de conclusão",
              }}
            />

            <StatCard
              title="Próximas Reuniões"
              value={stats?.meetings.upcoming || 0}
              description="Reuniões agendadas"
              icon={<Calendar className="h-4 w-4" />}
              href="/collaborator/meetings"
              trend={{
                value: 15,
                isPositive: true,
                label: "vs mês anterior",
              }}
            />

            <StatCard
              title="Notificações"
              value={stats?.notifications.unread || 0}
              description="Mensagens não lidas"
              icon={<Bell className="h-4 w-4" />}
              href="/collaborator/notifications"
              badge={
                stats?.notifications.unread
                  ? {
                      text: "Nova",
                      variant: "destructive",
                    }
                  : undefined
              }
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardChart
              title="Atividades Mensais"
              description="Progresso ao longo dos últimos 6 meses"
              data={progressData}
              type="line"
            />

            <DashboardChart
              title="Distribuição de Atividades"
              description="Suas atividades por categoria"
              data={chartData}
              type="pie"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <WeeklyProgress />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Taxa de Conclusão"
              value={`${stats?.trainings.completionRate || 0}%`}
              description="Porcentagem de treinamentos concluídos"
              icon={<Award className="h-4 w-4" />}
              progress={{
                value: stats?.trainings.completed || 0,
                max: stats?.trainings.total || 1,
                label: "Progresso geral",
              }}
            />

            <StatCard
              title="Módulos Completados"
              value={stats?.modules.completed || 0}
              description={`De ${stats?.modules.total || 0} disponíveis`}
              icon={<BookOpen className="h-4 w-4" />}
              href="/collaborator/modules"
              trend={{
                value: stats?.modules.completionRate || 0,
                isPositive: true,
                label: "taxa de conclusão",
              }}
            />

            <StatCard
              title="Aulas Assistidas"
              value={stats?.lessons.completed || 0}
              description={`De ${stats?.lessons.total || 0} aulas`}
              icon={<Clock className="h-4 w-4" />}
              href="/collaborator/lessons"
              progress={{
                value: stats?.lessons.completed || 0,
                max: stats?.lessons.total || 1,
                label: "Progresso das aulas",
              }}
            />
          </div>

          <DashboardChart
            title="Progresso de Aprendizado"
            description="Evolução mensal dos seus estudos"
            data={progressData}
            type="bar"
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Recebido"
              value={formatCurrency(stats?.financials.totalEarnings || 0)}
              description="Valor total já recebido"
              icon={<DollarSign className="h-4 w-4" />}
              trend={{
                value: 12,
                isPositive: true,
                label: "vs mês anterior",
              }}
            />

            <StatCard
              title="Valor Pendente"
              value={formatCurrency(stats?.financials.pendingAmount || 0)}
              description="Aguardando aprovação"
              icon={<Clock className="h-4 w-4" />}
              href="/collaborator/payment-requests"
            />

            <StatCard
              title="Solicitações Aprovadas"
              value={stats?.paymentRequests.approved || 0}
              description="Total de aprovações"
              icon={<TrendingUp className="h-4 w-4" />}
              badge={{
                text: `${
                  100 - (stats?.paymentRequests.rejectedPercentage || 0)
                }% aprovação`,
                variant: "default",
              }}
            />

            <StatCard
              title="Total de Solicitações"
              value={stats?.paymentRequests.total || 0}
              description="Histórico completo"
              icon={<BarChart3 className="h-4 w-4" />}
              href="/collaborator/payments"
            />
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity />
            <QuickActions />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
