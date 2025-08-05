"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  BookOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";

type ButtonVariant = "default" | "secondary" | "outline";
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  variant?: ButtonVariant;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = "" }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      title: "Nova Solicitação",
      description: "Criar solicitação de pagamento",
      href: "/collaborator/payment-requests/new",
      icon: <Plus className="h-4 w-4" />,
      variant: "default",
    },
    {
      title: "Minhas Reuniões",
      description: "Ver agenda de reuniões",
      href: "/collaborator/meetings",
      icon: <Calendar className="h-4 w-4" />,
      variant: "outline",
    },
    {
      title: "Treinamentos",
      description: "Continuar estudos",
      href: "/collaborator/trainings",
      icon: <BookOpen className="h-4 w-4" />,
      variant: "outline",
      badge: {
        text: "Em andamento",
        variant: "secondary",
      },
    },
    {
      title: "Módulos",
      description: "Acessar conteúdo",
      href: "/collaborator/modules",
      icon: <FileText className="h-4 w-4" />,
      variant: "outline",
    },
    {
      title: "Histórico Financeiro",
      description: "Ver pagamentos recebidos",
      href: "/collaborator/payments",
      icon: <DollarSign className="h-4 w-4" />,
      variant: "outline",
    },
    {
      title: "Notificações",
      description: "Ver mensagens importantes",
      href: "/collaborator/notifications",
      icon: <Bell className="h-4 w-4" />,
      variant: "outline",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant={action.variant || "default"}
              className="h-auto p-4 justify-start flex-col items-start gap-2 relative"
            >
              <Link href={action.href}>
                <div className="flex items-center gap-2 w-full">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                  {action.badge && (
                    <Badge
                      variant={action.badge.variant || "default"}
                      className="text-xs ml-auto"
                    >
                      {action.badge.text}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
