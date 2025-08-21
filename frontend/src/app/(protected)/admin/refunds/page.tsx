"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";
import { usePaymentActions } from "@/hooks/use-payment-actions";

// Components
import { PaymentFilters } from "@/components/payments/payment-filters";
import { PaymentItemList } from "@/components/payments/payment-item-list";
import { PaymentLayout } from "@/components/payments/payment-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryKeys } from "@/shared/constants/queryKeys";

// HTTP
import http from "@/lib/http";

// Tipos
interface Refund {
  id: number;
  userId: number;
  value: number;
  requestDate?: string;
  photoKey?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  reason?: string;
  approvedPhotoKey?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  refundTypeId?: number;
  RefundType?: {
    id: number;
    label: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface RefundResponse {
  data: Refund[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

interface RefundType {
  id: number;
  label: string;
}

// Componente principal da página
export default function RefundsPage() {
  const router = useRouter();
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
      refundTypeId: "refundTypeId",
      userId: "user",
    },
  });

  // Atualizar URL quando os filtros mudam
  useEffect(() => {
    const queryString = buildQueryString();
    router.replace(`/admin/refunds${queryString}`, { scroll: false });
  }, [router, buildQueryString]);

  // Parâmetros para a API
  const apiParams = new URLSearchParams();
  apiParams.append("page", page.toString());
  apiParams.append("per_page", perPage.toString());
  if (debouncedSearch) apiParams.append("search", debouncedSearch);
  if (filters.status) apiParams.append("status", filters.status);
  if (filters.refundTypeId)
    apiParams.append("refundTypeId", filters.refundTypeId);
  if (filters.userId) apiParams.append("user", filters.userId);

  // Carregamento de dados
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<RefundResponse>({
      queryKey: QueryKeys.refunds.list(buildQueryString()),
      queryFn: async () => {
        const response = await http.get<RefundResponse>(
          `/refund-admin?${apiParams}`
        );
        return response.data;
      },
      staleTime: 60000, // 1 minuto
    });

  // Tipos de reembolso (para filtro)
  const { data: refundTypes, isLoading: isLoadingTypes } = useQuery<
    RefundType[]
  >({
    queryKey: QueryKeys.autocomplete.fields(["refundTypes"]),
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=refundTypes");
      return response.data.refundTypes || [];
    },
    staleTime: 300000, // 5 minutos
  });

  // Hook de ações de pagamento
  const {
    pay: handlePay,
    cancel: handleCancel,
    downloadFile: handleDownloadFile,
    payMutation,
    cancelMutation,
  } = usePaymentActions({
    paymentType: "refund",
    invalidateQueryKey: QueryKeys.refunds.all,
  });

  // Dados processados
  const refunds = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const totalItems = data?.meta?.total || 0;

  return (
    <PaymentLayout
      title="Reembolsos"
      description="Visualize e gerencie todos os reembolsos do sistema"
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
              className={`w-[180px] ${filters.status ? "border-primary" : ""}`}
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
            value={filters.refundTypeId || "ALL"}
            onValueChange={(value) =>
              setFilter("refundTypeId", value === "ALL" ? undefined : value)
            }
            disabled={isLoadingTypes}
          >
            <SelectTrigger
              className={`w-[180px] ${
                filters.refundTypeId ? "border-primary" : ""
              }`}
            >
              <SelectValue
                placeholder={isLoadingTypes ? "Carregando..." : "Categoria"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as categorias</SelectItem>
              {refundTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PaymentFilters>
      }
    >
      <PaymentItemList
        title="Reembolsos"
        items={refunds}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRefetch={refetch}
        onPay={handlePay}
        onCancel={handleCancel}
        onDownloadFile={handleDownloadFile}
        isPending={{
          pay: (id) =>
            payMutation.isPending && payMutation.variables?.id === id,
          cancel: (id) =>
            cancelMutation.isPending && cancelMutation.variables?.id === id,
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
        getItemProps={(refund) => ({
          id: refund.id,
          description: refund.description,
          value: refund.value,
          userFullName:
            `${refund.user?.firstName || ""} ${
              refund.user?.lastName || ""
            }`.trim() || "Usuário sem nome",
          categoryLabel: refund.RefundType?.label,
          status: refund.status,
          createdAt: refund.createdAt,
          photoKey: refund.photoKey,
        })}
        emptyMessage="Nenhum reembolso disponível"
        filterEmptyMessage="Nenhum reembolso encontrado com os filtros aplicados"
      />
    </PaymentLayout>
  );
}
