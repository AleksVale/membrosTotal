"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Search,
  RefreshCw,
  Filter,
} from "lucide-react";

// HTTP and Utilities
import http from "@/lib/http";
import { toast } from "react-toastify";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CancelPaymentDialog } from "@/components/payments/cancel-payment-dialog";
import { PaymentDialog } from "@/components/payments/payment-dialog";
import { QueryKeys } from "@/shared/constants/queryKeys";

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

// Opções de itens por página
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Componente principal da página
export default function RefundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Inicializa estados com base nos parâmetros de URL
  const initialPage = Number(searchParams.get("page") || "1");
  const initialPerPage = Number(searchParams.get("per_page") || "10");
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || undefined;
  const initialType = searchParams.get("refundTypeId") || undefined;

  // Estados
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [refundTypeId, setRefundTypeId] = useState<string | undefined>(
    initialType
  );
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Gerar parâmetros de consulta para URL
  const queryParams = `page=${page}&per_page=${perPage}${
    debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""
  }${status ? `&status=${status}` : ""}${
    refundTypeId ? `&refundTypeId=${refundTypeId}` : ""
  }`;

  // Atualiza a URL quando os filtros mudam
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (perPage !== 10) params.set("per_page", perPage.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (refundTypeId) params.set("refundTypeId", refundTypeId);

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/admin/refunds${newUrl}`, { scroll: false });
  }, [page, perPage, debouncedSearch, status, refundTypeId, router]);

  // Debounce para busca
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (page !== 1) setPage(1); // Reset to first page on new search
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Carregamento de dados
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<RefundResponse>({
      queryKey: QueryKeys.refunds.list(queryParams),
      queryFn: async () => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (status) params.append("status", status);
        if (refundTypeId) params.append("refundTypeId", refundTypeId);

        const response = await http.get<RefundResponse>(
          `/refund-admin?${params}`
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

  // Mutations
  const payRefundMutation = useMutation({
    mutationFn: async ({
      id,
      reason,
      file,
    }: {
      id: number;
      reason?: string;
      file?: File | null;
    }) => {
      // Primeiro mudar o status para PAID
      const paymentResponse = await http.patch(`/refund-admin/${id}`, {
        status: "PAID",
        reason,
      });

      // Se houver um arquivo, fazer o upload
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await http.post(`/refund-admin/${id}/file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      return paymentResponse;
    },
    onSuccess: () => {
      toast.success("Reembolso marcado como pago com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.refunds.all });
    },
    onError: () => {
      toast.error("Erro ao marcar reembolso como pago");
    },
  });

  const cancelRefundMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return await http.patch(`/refund-admin/${id}`, {
        status: "CANCELLED",
        reason,
      });
    },
    onSuccess: () => {
      toast.success("Reembolso cancelado com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.refunds.all });
    },
    onError: () => {
      toast.error("Erro ao cancelar reembolso");
    },
  });

  // Manipuladores de eventos
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing per_page
  };

  const handlePay = (id: number, reason?: string, file?: File | null) => {
    payRefundMutation.mutate({ id, reason, file });
  };

  const handleCancel = (id: number, reason: string) => {
    cancelRefundMutation.mutate({ id, reason });
  };

  const handleDownloadFile = async (id: number) => {
    try {
      const response = await http.get(`/refund-admin/signed_url/${id}`);
      if (response.data.signedUrl) {
        window.open(response.data.signedUrl, "_blank");
      }
    } catch {
      toast.error("Erro ao obter arquivo");
    }
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearch("");
    setStatus(undefined);
    setRefundTypeId(undefined);
    setPage(1);
  };

  const refunds = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const totalItems = data?.meta?.total || 0;

  // Determinar se há filtros ativos
  const hasActiveFilters = debouncedSearch || status || refundTypeId;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reembolsos</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
            {hasActiveFilters && (
              <Badge className="ml-1" variant="secondary">
                !
              </Badge>
            )}
          </Button>

          <Select
            value={perPage.toString()}
            onValueChange={(value) => handlePerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={`${perPage} por página`} />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading || isFetching ? "animate-spin" : ""
              }`}
            />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reembolsos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os reembolsos do sistema
          </CardDescription>

          {/* Filtros visíveis ou em dropdown dependendo da preferência */}
          <div
            className={`flex flex-wrap items-center gap-2 ${
              !showFilters && !isMobile ? "hidden" : ""
            }`}
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reembolsos..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {isSearching && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
              )}
            </div>

            <Select
              value={status || "ALL"}
              onValueChange={(value) =>
                setStatus(value === "ALL" ? undefined : value)
              }
            >
              <SelectTrigger className="w-[180px]">
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
              value={refundTypeId || "ALL"}
              onValueChange={(value) =>
                setRefundTypeId(value === "ALL" ? undefined : value)
              }
              disabled={isLoadingTypes}
            >
              <SelectTrigger className="w-[180px]">
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

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && !data ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              <p>Erro ao carregar reembolsos.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              {/* Indicador de carregamento sobreposto quando estiver refetchando */}
              {isFetching && data && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {isMobile ? (
                // Layout Mobile (cards)
                <div className="space-y-4">
                  {refunds.length === 0 ? (
                    <div className="text-center py-6">
                      {hasActiveFilters
                        ? "Nenhum reembolso encontrado com os filtros aplicados"
                        : "Nenhum reembolso disponível"}
                    </div>
                  ) : (
                    refunds.map((refund) => (
                      <div
                        key={refund.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">
                            {refund.description}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {refund.photoKey && (
                                <DropdownMenuItem
                                  onClick={() => handleDownloadFile(refund.id)}
                                >
                                  Baixar Arquivo
                                </DropdownMenuItem>
                              )}
                              {refund.status === "PENDING" && (
                                <>
                                  <PaymentDialog
                                    paymentId={refund.id}
                                    onPay={(id, reason, file) => {
                                      handlePay(id, reason, file);
                                    }}
                                    isPending={
                                      payRefundMutation.isPending &&
                                      payRefundMutation.variables?.id ===
                                        refund.id
                                    }
                                  />
                                  <DropdownMenuSeparator />
                                  <CancelPaymentDialog
                                    paymentId={refund.id}
                                    onCancel={handleCancel}
                                    isPending={
                                      cancelRefundMutation.isPending &&
                                      cancelRefundMutation.variables?.id ===
                                        refund.id
                                    }
                                  />
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <div>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(refund.value)}
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <div>
                            <Badge
                              variant={
                                refund.status === "PAID"
                                  ? "default"
                                  : refund.status === "CANCELLED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {refund.status === "PAID"
                                ? "Pago"
                                : refund.status === "CANCELLED"
                                ? "Cancelado"
                                : "Pendente"}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">
                            Usuário:
                          </span>
                          <div>
                            {refund.user.firstName} {refund.user.lastName}
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">
                            Categoria:
                          </span>
                          <div>{refund.RefundType?.label || "N/A"}</div>
                        </div>

                        <div className="col-span-2">
                          <span className="text-muted-foreground">Data:</span>
                          <div>
                            {format(
                              new Date(refund.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Layout Desktop (tabela)
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refunds.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            {hasActiveFilters
                              ? "Nenhum reembolso encontrado com os filtros aplicados"
                              : "Nenhum reembolso disponível"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        refunds.map((refund) => (
                          <TableRow key={refund.id}>
                            <TableCell className="max-w-[200px] truncate">
                              {refund.description}
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(refund.value)}
                            </TableCell>
                            <TableCell>
                              {refund.user.firstName} {refund.user.lastName}
                            </TableCell>
                            <TableCell>
                              {refund.RefundType?.label || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  refund.status === "PAID"
                                    ? "default"
                                    : refund.status === "CANCELLED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {refund.status === "PAID"
                                  ? "Pago"
                                  : refund.status === "CANCELLED"
                                  ? "Cancelado"
                                  : "Pendente"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(refund.createdAt),
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: ptBR }
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {refund.photoKey && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDownloadFile(refund.id)
                                      }
                                    >
                                      Baixar Arquivo
                                    </DropdownMenuItem>
                                  )}
                                  {refund.status === "PENDING" && (
                                    <>
                                      <PaymentDialog
                                        paymentId={refund.id}
                                        onPay={(id, reason, file) => {
                                          handlePay(id, reason, file);
                                        }}
                                        isPending={
                                          payRefundMutation.isPending &&
                                          payRefundMutation.variables?.id ===
                                            refund.id
                                        }
                                      />
                                      <DropdownMenuSeparator />
                                      <CancelPaymentDialog
                                        paymentId={refund.id}
                                        onCancel={handleCancel}
                                        isPending={
                                          cancelRefundMutation.isPending &&
                                          cancelRefundMutation.variables?.id ===
                                            refund.id
                                        }
                                      />
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Mostrando {refunds.length} de {totalItems} reembolsos
                    {perPage !== 10 && ` (${perPage} por página)`}
                  </div>
                  <div className="flex items-center space-x-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || isLoading || isFetching}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Página anterior</span>
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(isMobile ? 3 : 5, totalPages) },
                        (_, i) => {
                          const pageNumber = isMobile
                            ? page <= 2
                              ? i + 1
                              : page >= totalPages - 1
                              ? totalPages - 2 + i
                              : page - 1 + i
                            : page <= 3
                            ? i + 1
                            : page >= totalPages - 2
                            ? totalPages - 4 + i
                            : page - 2 + i;

                          return pageNumber <= totalPages ? (
                            <Button
                              key={i}
                              variant={
                                pageNumber === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              disabled={isLoading || isFetching}
                            >
                              {pageNumber}
                            </Button>
                          ) : null;
                        }
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages || isLoading || isFetching}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Próxima página</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
