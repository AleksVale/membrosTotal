"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "meeting" | "payment" | "training" | "module";
  title: string;
  description: string;
  timestamp: Date;
  status?: "completed" | "pending" | "in_progress" | "cancelled";
  href?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  className?: string;
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "meeting":
      return <Calendar className="h-4 w-4" />;
    case "payment":
      return <DollarSign className="h-4 w-4" />;
    case "training":
      return <BookOpen className="h-4 w-4" />;
    case "module":
      return <BookOpen className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const getStatusBadge = (status?: ActivityItem["status"]) => {
  if (!status) return null;

  const statusConfig: Record<
    NonNullable<ActivityItem["status"]>,
    {
      text: string;
      variant: BadgeVariant;
      icon: React.ReactNode;
    }
  > = {
    completed: {
      text: "Concluído",
      variant: "default",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    pending: {
      text: "Pendente",
      variant: "secondary",
      icon: <Clock className="h-3 w-3" />,
    },
    in_progress: {
      text: "Em andamento",
      variant: "outline",
      icon: <Clock className="h-3 w-3" />,
    },
    cancelled: {
      text: "Cancelado",
      variant: "destructive",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="text-xs flex items-center gap-1">
      {config.icon}
      {config.text}
    </Badge>
  );
};

export function RecentActivity({
  activities = [],
  className = "",
}: RecentActivityProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: "1",
      type: "training",
      title: "Treinamento de Vendas",
      description: "Módulo 2 - Técnicas de negociação",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: "completed",
      href: "/collaborator/trainings",
    },
    {
      id: "2",
      type: "payment",
      title: "Solicitação de Pagamento",
      description: "Comissão de vendas - Março 2024",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      status: "pending",
      href: "/collaborator/payment-requests",
    },
    {
      id: "3",
      type: "meeting",
      title: "Reunião de Equipe",
      description: "Planejamento estratégico Q2 2024",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      status: "completed",
      href: "/collaborator/meetings",
    },
    {
      id: "4",
      type: "module",
      title: "Módulo de Marketing Digital",
      description: "Introdução às redes sociais",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      status: "in_progress",
      href: "/collaborator/modules",
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Atividades Recentes
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/collaborator/notifications">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          Suas últimas atividades e atualizações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    {getActivityIcon(activity.type)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>

                    {activity.href && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        asChild
                      >
                        <Link href={activity.href}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
