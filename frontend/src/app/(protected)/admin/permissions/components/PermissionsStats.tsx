"use client";

import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Shield, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";

interface PermissionsStatsProps {
  searchTerm: string;
  filterType: string;
}

interface StatsData {
  totalUsers: number;
  totalTrainings: number;
  totalModules: number;
  totalSubmodules: number;
  activePermissions: number;
  pendingPermissions: number;
  recentChanges: number;
}

export function PermissionsStats({
  searchTerm,
  filterType,
}: PermissionsStatsProps) {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["permissions-stats", searchTerm, filterType],
    queryFn: async () => {
      // Como não temos um endpoint específico, vamos simular com dados das APIs existentes
      const [trainingsRes, usersRes] = await Promise.all([
        http.get("/trainings-admin"),
        http.get("/autocomplete?fields=users"),
      ]);

      return {
        totalUsers: usersRes.data.users?.length || 0,
        totalTrainings: trainingsRes.data.meta?.total || 0,
        totalModules: 0, // Seria calculado agregando todos os módulos
        totalSubmodules: 0, // Seria calculado agregando todos os submódulos
        activePermissions: 150, // Simulado
        pendingPermissions: 12, // Simulado
        recentChanges: 8, // Simulado
      };
    },
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      description: "Usuários no sistema",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Treinamentos Ativos",
      value: stats?.totalTrainings || 0,
      description: "Com permissões configuradas",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Permissões Ativas",
      value: stats?.activePermissions || 0,
      description: "Acessos configurados",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Alterações Recentes",
      value: stats?.recentChanges || 0,
      description: "Últimas 24 horas",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-1 sm:p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
