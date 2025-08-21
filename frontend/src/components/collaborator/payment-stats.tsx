"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

interface PaymentStatsProps {
  data: {
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
  };
  isLoading: boolean;
}

export function PaymentStats({ data, isLoading }: PaymentStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Carregando...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalEarnings)}
          </div>
          <p className="text-xs text-muted-foreground">
            +{data.monthlyGrowth}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.pendingAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.pendingPayments} pagamentos aguardando
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagos</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.paidAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.paidPayments} pagamentos realizados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Média de {formatCurrency(data.averagePaymentValue)} por pagamento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
