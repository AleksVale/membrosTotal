"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PaymentChartProps {
  monthlyData: Array<{
    month: string;
    paid: number;
    pending: number;
    cancelled: number;
    total: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  isLoading: boolean;
}

export function PaymentChart({
  monthlyData,
  categoryData,
  isLoading,
}: PaymentChartProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Carregando gráficos...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal dos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Valor",
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="paid" fill="#22c55e" name="Pagos" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pendentes" />
                <Bar dataKey="cancelled" fill="#ef4444" name="Cancelados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  formatCurrency(props.payload.amount),
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
