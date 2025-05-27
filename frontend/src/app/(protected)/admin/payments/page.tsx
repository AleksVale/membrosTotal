"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DollarSign } from "lucide-react";

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";

// Components
import { PaymentLayout } from "@/components/payments/payment-layout";
import { PaymentFilters } from "@/components/payments/payment-filters";
import { PaymentItemList } from "@/components/payments/payment-item-list";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// HTTP
import http from "@/lib/http";
import { toast } from "react-toastify";
import { AutocompleteItem } from "@/shared/types/autocomplete";

interface Payment {
  id: number;
  description: string;
  value: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  photoKey?: string;
  paymentType: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface PaymentsResponse {
  data: Payment[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function PaymentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      userId: "user",
    },
  });

  // Atualizar URL quando os filtros mudam
  useEffect(() => {
    const queryString = buildQueryString();
    router.replace(`/admin/payments${queryString}`, { scroll: false });
  }, [router, buildQueryString]);

  // Parâmetros para a API
  const apiParams = new URLSearchParams();
  apiParams.append("page", page.toString());
  apiParams.append("per_page", perPage.toString());
  if (debouncedSearch) apiParams.append("search", debouncedSearch);
  if (filters.status) apiParams.append("status", filters.status);
  if (filters.paymentTypeId)
    apiParams.append("paymentTypeId", filters.paymentTypeId);
  if (filters.userId) apiParams.append("user", filters.userId);

  // Carregamento de dados
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<PaymentsResponse>({
      queryKey: QueryKeys.payments.list(buildQueryString()),
      queryFn: async () => {
        const response = await http.get<PaymentsResponse>(
          `/payment-admin?${apiParams}`
        );
        return response.data;
      },
      staleTime: 60000, // 1 minuto
      refetchOnWindowFocus: false,
    });

  // Tipos de pagamento (para filtro)
  const { data: paymentTypes, isLoading: isLoadingTypes } = useQuery<
    AutocompleteItem[]
  >({
    queryKey: QueryKeys.autocomplete.fields(["paymentTypes"]),
    queryFn: async () => {
      const response = await http.get<{
        paymentTypes: AutocompleteItem[];
      }>("/autocomplete?fields=paymentTypes");
      return response.data.paymentTypes || [];
    },
    staleTime: 300000, // 5 minutos
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/payment-admin/${id}`),
    onSuccess: () => {
      toast.success("Pagamento removido com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.payments.all });
    },
    onError: () => {
      toast.error("Não foi possível remover o pagamento");
    },
  });

  // Pay payment mutation
  const payPaymentMutation = useMutation({
    mutationFn: (id: number) => http.patch(`/payment-admin/${id}/pay`),
    onSuccess: () => {
      toast.success("Pagamento realizado com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.payments.all });
    },
    onError: () => {
      toast.error("Não foi possível realizar o pagamento");
    },
  });

  const handleDelete = (id: number) => {
    deletePaymentMutation.mutate(id);
  };

  const handlePay = (id: number) => {
    payPaymentMutation.mutate(id);
  };

  // Download de arquivo (se aplicável)
  const handleDownloadFile = async (id: number) => {
    try {
      const response = await http.get(`/payment-admin/signed_url/${id}`);
      if (response.data.signedUrl) {
        window.open(response.data.signedUrl, "_blank");
      }
    } catch {
      toast.error("Erro ao obter arquivo");
    }
  };

  const payments = data?.data || [];
  const totalPages =
    data?.meta?.last_page || Math.ceil((data?.meta?.total || 0) / perPage);
  const totalItems = data?.meta?.total || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os pagamentos do sistema
          </p>
        </div>
        <Button onClick={() => router.push("/admin/payments/new")}>
          <DollarSign className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      <PaymentLayout
        title="Lista de Pagamentos"
        description="Visualize e gerencie todos os pagamentos do sistema"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
        perPage={perPage}
        onPerPageChange={(value) => {
          setPerPage(value);
          setPage(1);
        }}
        onRefresh={refetch}
        isLoading={isLoading}
        isFetching={isFetching}
        filterContent={
          <PaymentFilters
            showFilters={showFilters}
            isMobile={isMobile}
            search={search}
            onSearchChange={setSearch}
            isSearching={isSearching}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          >
            <Select
              value={filters.status || "ALL"}
              onValueChange={(value) =>
                setFilter("status", value === "ALL" ? undefined : value)
              }
            >
              <SelectTrigger
                className={`w-[180px] ${
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

            <Select
              value={filters.paymentTypeId || "ALL"}
              onValueChange={(value) =>
                setFilter("paymentTypeId", value === "ALL" ? undefined : value)
              }
              disabled={isLoadingTypes}
            >
              <SelectTrigger
                className={`w-[180px] ${
                  filters.paymentTypeId ? "border-primary" : ""
                }`}
              >
                <SelectValue
                  placeholder={isLoadingTypes ? "Carregando..." : "Tipo"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                {paymentTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.label || type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PaymentFilters>
        }
      >
        <PaymentItemList
          title="Pagamentos"
          items={payments}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          onRefetch={refetch}
          onPay={handlePay}
          onCancel={handleDelete}
          onDownloadFile={handleDownloadFile}
          isPending={{
            pay: (id) =>
              payPaymentMutation.isPending &&
              payPaymentMutation.variables === id,
            cancel: (id) =>
              deletePaymentMutation.isPending &&
              deletePaymentMutation.variables === id,
          }}
          hasActiveFilters={hasActiveFilters}
          isMobile={isMobile}
          pagination={{
            page,
            perPage,
            totalPages,
            totalItems,
            onPageChange: setPage,
          }}
          getItemProps={(payment) => ({
            id: payment.id,
            description: payment.description,
            value: payment.value,
            userFullName: `${payment.user.firstName} ${payment.user.lastName}`,
            categoryLabel: payment.paymentType.name,
            status: payment.status,
            createdAt: payment.createdAt,
            photoKey: payment.photoKey,
          })}
          emptyMessage="Nenhum pagamento disponível"
          filterEmptyMessage="Nenhum pagamento encontrado com os filtros aplicados"
        />
      </PaymentLayout>
    </div>
  );
}
