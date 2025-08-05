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
import {
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  History,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type ButtonVariant = "default" | "secondary" | "outline";
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface QuickAction {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  variant: ButtonVariant;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
}

interface PaymentActionsProps {
  onNewPayment?: () => void;
  onExportData?: () => void;
  onFilterToggle?: () => void;
  showFilters?: boolean;
  pendingCount?: number;
  className?: string;
}

export function PaymentActions({
  onNewPayment,
  onExportData,
  onFilterToggle,
  showFilters = false,
  pendingCount = 0,
  className = "",
}: PaymentActionsProps) {
  const quickActions: QuickAction[] = [
    {
      title: "Novo Pagamento",
      description: "Solicitar novo pagamento",
      onClick: onNewPayment,
      icon: <Plus className="h-4 w-4" />,
      variant: "default",
    },
    {
      title: "Exportar Relatório",
      description: "Download dos seus dados",
      onClick: onExportData,
      icon: <Download className="h-4 w-4" />,
      variant: "outline",
    },
    {
      title: "Histórico Completo",
      description: "Ver todos os pagamentos",
      href: "/collaborator/payments/history",
      icon: <History className="h-4 w-4" />,
      variant: "outline",
    },
    {
      title: "Relatórios",
      description: "Análises detalhadas",
      href: "/collaborator/payments/reports",
      icon: <TrendingUp className="h-4 w-4" />,
      variant: "outline",
    },
  ];

  const quickStats = [
    {
      label: "Pendentes",
      value: pendingCount,
      icon: <Calendar className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Este Mês",
      value: "R$ 2.850",
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Última Semana",
      value: "3",
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={onFilterToggle}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action, index) => {
              if (action.href) {
                return (
                  <Button
                    key={index}
                    asChild
                    variant={action.variant}
                    className="h-auto p-4 justify-start flex-col items-start gap-2 w-full text-left"
                  >
                    <Link href={action.href}>
                      <div className="flex items-center gap-2 w-full">
                        {action.icon}
                        <span className="font-medium">{action.title}</span>
                        {action.badge && (
                          <Badge
                            variant={action.badge.variant}
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
                );
              }

              return (
                <Button
                  key={index}
                  variant={action.variant}
                  className="h-auto p-4 justify-start flex-col items-start gap-2 w-full text-left"
                  onClick={action.onClick}
                >
                  <div className="flex items-center gap-2 w-full">
                    {action.icon}
                    <span className="font-medium">{action.title}</span>
                    {action.badge && (
                      <Badge
                        variant={action.badge.variant}
                        className="text-xs ml-auto"
                      >
                        {action.badge.text}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {action.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo Rápido
          </CardTitle>
          <CardDescription>
            Informações importantes sobre seus pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${stat.bgColor} border`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${stat.color}`}>{stat.icon}</div>
                  <span className="font-medium">{stat.label}</span>
                </div>
                <div className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted/50 border-l-4 border-l-primary">
            <div className="flex items-start gap-3">
              <div className="text-primary mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Dica</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Mantenha seus comprovantes organizados e envie-os assim que
                  possível para acelerar o processamento dos pagamentos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
