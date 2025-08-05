"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: "info" | "success" | "warning" | "error";
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: QueryKeys.collaborator.notifications.all,
    queryFn: async () => {
      const response = await http.get("/collaborator/home");
      return response.data.notifications || [];
    },
    staleTime: 30000, // 30 segundos
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await http.patch(`/collaborator/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.notifications.all,
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await http.patch("/collaborator/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.notifications.all,
      });
    },
  });

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

  const getBadgeVariant = (type?: string): BadgeVariant => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredNotifications =
    notifications?.filter((notification) => {
      if (filter === "unread") return !notification.read;
      if (filter === "read") return notification.read;
      return true;
    }) || [];

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar as notificações. Tente novamente.
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notificações
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas notificações e mantenha-se atualizado
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="destructive">
                {unreadCount} não lidas
              </Badge>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              variant="outline"
              size="sm"
              disabled={markAllAsReadMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Todas ({notifications?.length || 0})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Não lidas ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
        >
          Lidas ({(notifications?.length || 0) - unreadCount})
        </Button>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {filter === "all"
                ? "Nenhuma notificação encontrada"
                : filter === "unread"
                ? "Nenhuma notificação não lida"
                : "Nenhuma notificação lida"}
            </h3>
            <p className="text-muted-foreground text-center">
              {filter === "all"
                ? "Você não possui notificações no momento."
                : filter === "unread"
                ? "Todas as suas notificações foram lidas."
                : "Você não possui notificações lidas."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read
                  ? "border-l-4 border-l-primary bg-primary/5"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      {getNotificationIcon(notification.type)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className={`font-medium ${
                          !notification.read ? "font-semibold" : ""
                        }`}
                      >
                        {notification.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        {notification.type && (
                          <Badge
                            variant={getBadgeVariant(notification.type)}
                            className="text-xs"
                          >
                            {notification.type === "success"
                              ? "Sucesso"
                              : notification.type === "warning"
                              ? "Aviso"
                              : notification.type === "error"
                              ? "Erro"
                              : "Info"}
                          </Badge>
                        )}

                        {!notification.read && (
                          <Badge variant="destructive" className="text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>

                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            markAsReadMutation.mutate(notification.id)
                          }
                          disabled={markAsReadMutation.isPending}
                          className="h-8 px-2"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
