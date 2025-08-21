"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { ListFilter, Loader2, PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Custom hooks
import {
  useCollaboratorPayments,
  usePaymentCategoryStats,
  usePaymentMonthlyStats,
  usePaymentOverviewStats,
} from "@/hooks/collaborator/use-payments";
import { usePaginationFilters } from "@/hooks/use-pagination-filters";

// Components
import { PaymentActions } from "@/components/collaborator/payment-actions";
import { PaymentChart } from "@/components/collaborator/payment-chart";
import { PaymentForm } from "@/components/collaborator/payment-form";
import { PaymentList } from "@/components/collaborator/payment-list";
import { PaymentStats } from "@/components/collaborator/payment-stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

// HTTP
import http from "@/lib/http";

export default function PaymentsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("list");

  // Hook de paginação e filtros
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    showFilters,
    setShowFilters,
    filters,
    setFilter,
    clearFilters,
    buildQueryString,
    activeFiltersCount,
    hasActiveFilters,
  } = usePaginationFilters({
    defaultPerPage: 10,
    paramMapping: {
      status: "status",
      paymentTypeId: "paymentTypeId",
    },
  });

  // Atualizar URL quando os filtros mudam
  useEffect(() => {
    const queryString = buildQueryString();
    router.replace(`/collaborator/payments${queryString}`, {
      scroll: false,
    });
  }, [router, buildQueryString]);

  // Parâmetros para a API
  const apiParams = new URLSearchParams();
  apiParams.append("page", page.toString());
  apiParams.append("per_page", perPage.toString());
  if (debouncedSearch) apiParams.append("search", debouncedSearch);
  if (filters.status) apiParams.append("status", filters.status);
  if (filters.paymentTypeId)
    apiParams.append("paymentTypeId", filters.paymentTypeId);

  // Carregamento de dados
  const { data, isLoading, isError, refetch, isFetching } =
    useCollaboratorPayments(apiParams);

  // Estatísticas da API
  const { data: statsData, isLoading: isLoadingStats } =
    usePaymentOverviewStats();
  const { data: monthlyData, isLoading: isLoadingMonthly } =
    usePaymentMonthlyStats(6);
  const { data: categoryData, isLoading: isLoadingCategories } =
    usePaymentCategoryStats();

  // Download de arquivo
  const handleDownloadFile = async (id: number) => {
    try {
      const response = await http.get(`/collaborator/payments/${id}/file`);
      if (response.data.signedUrl) {
        window.open(response.data.signedUrl, "_blank");
      }
    } catch {
      toast.error("Erro ao baixar o arquivo");
    }
  };

  // Dados processados
  const payments = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const totalItems = data?.meta?.total || 0;

  // Estados de loading combinados
  const isAnalyticsLoading =
    isLoadingStats || isLoadingMonthly || isLoadingCategories;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie seus pagamentos</p>
        </div>
        <Button onClick={() => setActiveTab("new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Meus Pagamentos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="new">Novo Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle>Meus Pagamentos</CardTitle>
                  <CardDescription>
                    {hasActiveFilters
                      ? `${totalItems} pagamentos encontrados com os filtros aplicados`
                      : `${totalItems} pagamentos no total`}
                  </CardDescription>
                </div>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                  >
                    <ListFilter className="h-4 w-4 mr-1" />
                    Filtros
                    {hasActiveFilters && (
                      <Badge
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                        variant="destructive"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  <Select
                    value={perPage.toString()}
                    onValueChange={(value) => {
                      setPerPage(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="10 itens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 itens</SelectItem>
                      <SelectItem value="10">10 itens</SelectItem>
                      <SelectItem value="20">20 itens</SelectItem>
                      <SelectItem value="50">50 itens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            {showFilters && (
              <CardContent className="border-t pt-3 pb-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pagamentos..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                    )}
                  </div>

                  <Select
                    value={filters.status || "ALL"}
                    onValueChange={(value) =>
                      setFilter("status", value === "ALL" ? undefined : value)
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${
                        filters.status ? "border-primary" : ""
                      }`}
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos os status</SelectItem>
                      <SelectItem value="PENDING">Pendentes</SelectItem>
                      <SelectItem value="PAID">Pagos</SelectItem>
                      <SelectItem value="CANCELLED">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="w-fit h-10"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          <PaymentList
            payments={payments}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            onRefetch={refetch}
            onDownloadFile={handleDownloadFile}
            hasActiveFilters={hasActiveFilters}
            isMobile={isMobile}
            pagination={{
              page,
              perPage,
              totalPages,
              totalItems,
              onPageChange: setPage,
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-4">
          <PaymentStats data={statsData || {}} isLoading={isAnalyticsLoading} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PaymentChart
                monthlyData={monthlyData || []}
                categoryData={categoryData || []}
                isLoading={isAnalyticsLoading}
              />
            </div>
            <PaymentActions
              onNewPayment={() => setActiveTab("new")}
              onExportData={() => {
                toast.success("Relatório será enviado por email!");
              }}
              onFilterToggle={() => setShowFilters(!showFilters)}
              showFilters={showFilters}
              pendingCount={statsData?.pendingPayments || 0}
            />
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <PaymentForm
            onSuccess={() => {
              setActiveTab("list");
              refetch();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
