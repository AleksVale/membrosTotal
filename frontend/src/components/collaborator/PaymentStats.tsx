"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

interface PaymentStatsData {
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  cancelledAmount: number;
  totalPayments: number;
  pendingPayments: number;
  paidPayments: number;
  cancelledPayments: number;
  monthlyGrowth: number;
  averagePaymentValue: number;
  successRate: number;
}

interface PaymentStatsProps {
  data: PaymentStatsData;
  isLoading?: boolean;
  className?: string;
}

export function PaymentStats({
  data,
  isLoading = false,
  className = "",
}: PaymentStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Recebido"
          value={formatCurrency(data.paidAmount)}
          description="Valor total já recebido"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            value: data.monthlyGrowth,
            isPositive: data.monthlyGrowth > 0,
            label: "vs mês anterior",
          }}
          className="border-green-200 bg-green-50/50"
        />

        <StatCard
          title="Aguardando Pagamento"
          value={formatCurrency(data.pendingAmount)}
          description={`${data.pendingPayments} pagamentos pendentes`}
          icon={<Clock className="h-4 w-4" />}
          badge={{
            text: `${data.pendingPayments} pendentes`,
            variant: "secondary",
          }}
          className="border-yellow-200 bg-yellow-50/50"
        />

        <StatCard
          title="Taxa de Sucesso"
          value={`${data.successRate}%`}
          description="Pagamentos aprovados"
          icon={<Target className="h-4 w-4" />}
          progress={{
            value: data.paidPayments,
            max: data.totalPayments,
            label: "Pagamentos processados",
          }}
          className="border-blue-200 bg-blue-50/50"
        />

        <StatCard
          title="Valor Médio"
          value={formatCurrency(data.averagePaymentValue)}
          description="Por pagamento"
          icon={<BarChart3 className="h-4 w-4" />}
          badge={{
            text: `${data.totalPayments} total`,
            variant: "outline",
          }}
          className="border-purple-200 bg-purple-50/50"
        />
      </div>

      {/* Resumo detalhado */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição de Pagamentos
            </CardTitle>
            <CardDescription>Status dos seus pagamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Pagos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.paidPayments}
                  </span>
                  <Badge variant="default" className="text-xs">
                    {formatCurrency(data.paidAmount)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={
                  data.totalPayments > 0
                    ? (data.paidPayments / data.totalPayments) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pendentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.pendingPayments}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {formatCurrency(data.pendingAmount)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={
                  data.totalPayments > 0
                    ? (data.pendingPayments / data.totalPayments) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Cancelados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.cancelledPayments}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {formatCurrency(data.cancelledAmount)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={
                  data.totalPayments > 0
                    ? (data.cancelledPayments / data.totalPayments) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Performance
            </CardTitle>
            <CardDescription>Indicadores de desempenho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">
                  {data.successRate}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Taxa de Aprovação
                </div>
              </div>

              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.averagePaymentValue)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Ticket Médio
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Crescimento Mensal</span>
                <span
                  className={`font-medium ${
                    data.monthlyGrowth > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.monthlyGrowth > 0 ? "+" : ""}
                  {data.monthlyGrowth}%
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Total de Pagamentos</span>
                <span className="font-medium">{data.totalPayments}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Volume Total</span>
                <span className="font-medium">
                  {formatCurrency(data.totalEarnings)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
