"use client";

import { Badge } from "@/components/ui/badge";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Check, CheckCheck } from "lucide-react";
import { toast } from "react-toastify";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  link?: string;
}

interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
    unread: number;
  };
}

export default function CollaboratorNotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NotificationsResponse>({
    queryKey: QueryKeys.notifications.list("collaborator"),
    queryFn: async () => {
      const response = await http.get("/collaborator-notification");
      return response.data;
    },
    staleTime: 60000, // 1 minuto
  });

  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      await http.patch(`/collaborator-notification/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.notifications.all });
      toast.success("Notificação marcada como lida");
    },
    onError: () => {
      toast.error("Erro ao marcar notificação como lida");
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await http.patch("/collaborator-notification/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.notifications.all });
      toast.success("Todas as notificações marcadas como lidas");
    },
    onError: () => {
      toast.error("Erro ao marcar todas notificações como lidas");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar as notificações.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unread || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground">Gerencie suas notificações</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Você não tem notificações.
            </p>
            <p className="text-sm text-muted-foreground">
              Quando houver novidades, elas aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors ${
                !notification.isRead ? "bg-primary/5" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <CardTitle className="text-lg">
                      {notification.title}
                    </CardTitle>
                    {!notification.isRead && (
                      <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground"
                      >
                        Nova
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
                <CardDescription className="mt-1">
                  {notification.message}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {notification.type === "PAYMENT"
                      ? "Pagamento"
                      : notification.type === "TRAINING"
                      ? "Treinamento"
                      : notification.type === "MEETING"
                      ? "Reunião"
                      : "Sistema"}
                  </Badge>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead.mutate(notification.id);
                      }}
                      disabled={
                        markAsRead.isPending &&
                        markAsRead.variables === notification.id
                      }
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
