"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { PaymentFilter } from "@/components/collaborator/payment-filter";
import { PaymentForm } from "@/components/collaborator/payment-form";
import { PaymentList } from "@/components/collaborator/payment-list";
import { PaymentActions } from "@/components/collaborator/PaymentActions";
import { PaymentChart } from "@/components/collaborator/PaymentChart";
import { PaymentStats } from "@/components/collaborator/PaymentStats";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelPayment,
  useCollaboratorPayments,
} from "@/hooks/collaborator/use-payments";
import http from "@/lib/http";
import {
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Estados
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [perPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Mutations
  const cancelPayment = useCancelPayment();

  // Construir parâmetros de consulta
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", perPage.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params;
  }, [page, perPage, filters]);

  // Buscar pagamentos
  const { data, isLoading, isFetching, isError, refetch } =
    useCollaboratorPayments(buildQueryParams());

  // Atualizar URL quando os parâmetros mudarem
  useEffect(() => {
    const params = buildQueryParams();
    const url = `?${params.toString()}`;
    router.replace(url, { scroll: false });
  }, [buildQueryParams, router]);

  // Dados simulados para demonstração (em produção viriam da API)
  const statsData = {
    totalEarnings: 15750.0,
    pendingAmount: 2850.0,
    paidAmount: 12900.0,
    cancelledAmount: 450.0,
    totalPayments: 28,
    pendingPayments: 5,
    paidPayments: 21,
    cancelledPayments: 2,
    monthlyGrowth: 12.5,
    averagePaymentValue: 562.5,
    successRate: 89.3,
  };

  const monthlyData = [
    { month: "Jul", paid: 2100, pending: 300, cancelled: 0, total: 2400 },
    { month: "Ago", paid: 2800, pending: 450, cancelled: 150, total: 3400 },
    { month: "Set", paid: 3200, pending: 600, cancelled: 0, total: 3800 },
    { month: "Out", paid: 2950, pending: 800, cancelled: 300, total: 4050 },
    { month: "Nov", paid: 3100, pending: 700, cancelled: 0, total: 3800 },
    { month: "Dez", paid: 2850, pending: 950, cancelled: 0, total: 3800 },
  ];

  const categoryData = [
    { name: "Comissões", value: 15, amount: 8500, color: "#8884d8" },
    { name: "Bônus", value: 8, amount: 4200, color: "#82ca9d" },
    { name: "Horas Extra", value: 3, amount: 1850, color: "#ffc658" },
    { name: "Reembolsos", value: 2, amount: 1200, color: "#ff7300" },
  ];

  // Manipuladores
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleCancelPayment = (id: number, reason: string) => {
    cancelPayment.mutate(
      { id, reason },
      {
        onSuccess: () => {
          refetch();
          toast.success("Pagamento cancelado com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao cancelar pagamento");
        },
      }
    );
  };

  const handleDownloadFile = async (id: number) => {
    try {
      const response = await http.get(`/collaborator/payments/${id}/file`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comprovante-pagamento-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Arquivo baixado com sucesso!");
    } catch {
      toast.error("Erro ao baixar o arquivo");
    }
  };

  const handleExportData = async () => {
    try {
      // Implementar exportação de dados
      toast.success("Relatório será enviado por email!");
    } catch {
      toast.error("Erro ao exportar dados");
    }
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Meus Pagamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os seus pagamentos e ganhos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PaymentStats data={statsData} isLoading={isLoading} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PaymentChart
                monthlyData={monthlyData}
                categoryData={categoryData}
                isLoading={isLoading}
              />
            </div>
            <PaymentActions
              onNewPayment={() => setIsFormOpen(true)}
              onExportData={handleExportData}
              onFilterToggle={() => setShowFilters(!showFilters)}
              showFilters={showFilters}
              pendingCount={statsData.pendingPayments}
            />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {showFilters && (
            <PaymentFilter
              onFilter={handleFilter}
              initialFilters={filters}
              onClearFilters={handleClearFilters}
            />
          )}

          <PaymentList
            payments={data?.data || []}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            onRefetch={refetch}
            onCancel={handleCancelPayment}
            onDownloadFile={handleDownloadFile}
            isPending={{
              cancel: (id) =>
                cancelPayment.isPending && cancelPayment.variables?.id === id,
            }}
            hasActiveFilters={hasActiveFilters}
            isMobile={isMobile}
            pagination={{
              page,
              perPage,
              totalPages: data?.meta?.last_page || 1,
              totalItems: data?.meta?.total || 0,
              onPageChange: handlePageChange,
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <PaymentChart
              monthlyData={monthlyData}
              categoryData={categoryData}
              isLoading={isLoading}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendências
                  </CardTitle>
                  <CardDescription>
                    Análise de crescimento e performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Crescimento mensal</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taxa de aprovação</span>
                      <span className="font-medium">89.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        Tempo médio de processamento
                      </span>
                      <span className="font-medium">3.2 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximos Pagamentos
                  </CardTitle>
                  <CardDescription>
                    Pagamentos esperados para os próximos dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Comissão Dezembro</div>
                        <div className="text-xs text-muted-foreground">
                          Previsão: 15/01
                        </div>
                      </div>
                      <div className="font-medium">R$ 1.200</div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Bônus Anual</div>
                        <div className="text-xs text-muted-foreground">
                          Previsão: 20/01
                        </div>
                      </div>
                      <div className="font-medium">R$ 2.500</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios Disponíveis
                </CardTitle>
                <CardDescription>
                  Gere relatórios detalhados dos seus pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Relatório Mensal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Análise Anual
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Extrato Detalhado
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Relatório</CardTitle>
                <CardDescription>Personalize seus relatórios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <label className="font-medium">Período</label>
                    <p className="text-muted-foreground">Últimos 6 meses</p>
                  </div>
                  <div className="text-sm">
                    <label className="font-medium">Formato</label>
                    <p className="text-muted-foreground">PDF, Excel</p>
                  </div>
                  <div className="text-sm">
                    <label className="font-medium">Entrega</label>
                    <p className="text-muted-foreground">Email, Download</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Pagamento</DialogTitle>
          </DialogHeader>
          <PaymentForm
            onSuccess={() => {
              setIsFormOpen(false);
              refetch();
              toast.success("Pagamento criado com sucesso!");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
