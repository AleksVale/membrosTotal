"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  pendingPaymentRequests: number;
  completedTrainings: number;
  inProgressTrainings: number;
  upcomingMeetings: number;
}

export default function CollaboratorDashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: QueryKeys.collaborator.dashboard,
    queryFn: async () => {
      const response = await http.get("/collaborator/home");
      return response.data;
    },
    staleTime: 60000, // 1 minuto
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar os dados do dashboard.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const stats = [
    {
      title: "Solicitações Pendentes",
      value: data?.pendingPaymentRequests || 0,
      description: "Solicitações de pagamento aguardando aprovação",
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      href: "/collaborator/payment-requests",
      color: "bg-warning/20",
    },
    {
      title: "Treinamentos Concluídos",
      value: data?.completedTrainings || 0,
      description: "Treinamentos que você já completou",
      icon: <BookOpen className="h-5 w-5 text-muted-foreground" />,
      href: "/collaborator/trainings",
      color: "bg-success/20",
    },
    {
      title: "Treinamentos em Andamento",
      value: data?.inProgressTrainings || 0,
      description: "Treinamentos que você está fazendo",
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      href: "/collaborator/trainings",
      color: "bg-primary/20",
    },
    {
      title: "Próximas Reuniões",
      value: data?.upcomingMeetings || 0,
      description: "Reuniões agendadas para os próximos dias",
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      href: "/collaborator/meetings",
      color: "bg-secondary/20",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-1 ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <Button asChild variant="link" className="px-0 mt-2">
                <Link href={stat.href}>Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Treinamentos Recentes</CardTitle>
            <CardDescription>Seus treinamentos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse a seção de treinamentos para ver todos os seus cursos.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/collaborator/trainings">Ver Treinamentos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Pagamento</CardTitle>
            <CardDescription>
              Gerencie suas solicitações de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie e acompanhe suas solicitações de pagamento.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/collaborator/payment-requests">
                Ver Solicitações
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
