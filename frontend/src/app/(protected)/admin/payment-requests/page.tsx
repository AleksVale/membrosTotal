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
interface PaymentRequest {
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
  paymentRequestTypeId?: number;
  PaymentRequestType?: {
    id: number;
    label: string;
  };
  User: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface PaymentRequestResponse {
  data: PaymentRequest[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

interface PaymentRequestType {
  id: number;
  label: string;
}

// Componente principal da página
export default function PaymentRequestsPage() {
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
      paymentRequestTypeId: "paymentRequestTypeId",
      userId: "user",
    },
  });

  // Atualizar URL quando os filtros mudam
  useEffect(() => {
    const queryString = buildQueryString();
    router.replace(`/admin/payment-requests${queryString}`, { scroll: false });
  }, [router, buildQueryString]);

  // Parâmetros para a API
  const apiParams = new URLSearchParams();
  apiParams.append("page", page.toString());
  apiParams.append("per_page", perPage.toString());
  if (debouncedSearch) apiParams.append("search", debouncedSearch);
  if (filters.status) apiParams.append("status", filters.status);
  if (filters.paymentRequestTypeId)
    apiParams.append("paymentRequestTypeId", filters.paymentRequestTypeId);
  if (filters.userId) apiParams.append("user", filters.userId);

  // Carregamento de dados
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<PaymentRequestResponse>({
      // Use the actual query parameters string for the query key
      queryKey: QueryKeys.paymentRequests.list(apiParams.toString()),
      queryFn: async () => {
        const response = await http.get<PaymentRequestResponse>(
          `/payment-request-admin?${apiParams}`
        );
        return response.data;
      },
      staleTime: 60000, // 1 minuto
      refetchOnWindowFocus: false, // Prevent unwanted refetches
    });

  // Tipos de solicitação de pagamento (para filtro)
  const { data: paymentRequestTypes, isLoading: isLoadingTypes } = useQuery<
    PaymentRequestType[]
  >({
    queryKey: QueryKeys.autocomplete.fields(["paymentRequest"]),
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=paymentRequest");
      return response.data.paymentRequest || [];
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
    paymentType: "payment-request",
    invalidateQueryKey: QueryKeys.paymentRequests.all,
  });

  // Dados processados
  const paymentRequests = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const totalItems = data?.meta?.total || 0;

  return (
    <PaymentLayout
      title="Solicitações de Pagamento"
      description="Visualize e gerencie todas as solicitações de pagamento do sistema"
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
            value={filters.paymentRequestTypeId || "ALL"}
            onValueChange={(value) =>
              setFilter(
                "paymentRequestTypeId",
                value === "ALL" ? undefined : value
              )
            }
            disabled={isLoadingTypes}
          >
            <SelectTrigger
              className={`w-[180px] ${
                filters.paymentRequestTypeId ? "border-primary" : ""
              }`}
            >
              <SelectValue
                placeholder={isLoadingTypes ? "Carregando..." : "Categoria"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as categorias</SelectItem>
              {paymentRequestTypes?.map((type) => (
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
        title="Solicitações de Pagamento"
        items={paymentRequests}
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
        getItemProps={(request) => ({
          id: request.id,
          description: request.description,
          value: request.value,
          userFullName:
            `${request.User?.firstName || ""} ${
              request.User?.lastName || ""
            }`.trim() || "Usuário sem nome",
          categoryLabel: request.PaymentRequestType?.label,
          status: request.status,
          createdAt: request.createdAt,
          photoKey: request.photoKey,
        })}
        emptyMessage="Nenhuma solicitação disponível"
        filterEmptyMessage="Nenhuma solicitação encontrada com os filtros aplicados"
      />
    </PaymentLayout>
  );
}
