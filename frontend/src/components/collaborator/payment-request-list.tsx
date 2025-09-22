"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, MoreHorizontal, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/payments/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/ui/loading";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentRequest {
  id: number;
  description: string;
  value: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  photoKey?: string;
  PaymentRequestType?: {
    id: number;
    label: string;
  };
}

interface PaymentRequestListProps {
  paymentRequests: PaymentRequest[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onCancel: (id: number) => void;
  onDownloadFile?: (id: number) => void;
  isPending: {
    cancel: (id: number) => boolean;
  };
  hasActiveFilters: boolean;
  isMobile: boolean;
  pagination: {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export function PaymentRequestList({
  paymentRequests,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onCancel,
  onDownloadFile,
  isPending,
  hasActiveFilters,
  isMobile,
  pagination,
}: PaymentRequestListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          Ocorreu um erro ao carregar as solicitações de pagamento.
        </p>
        <Button onClick={onRefetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (paymentRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {hasActiveFilters
            ? "Nenhuma solicitação encontrada com os filtros aplicados"
            : "Você ainda não tem solicitações de pagamento"}
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Solicitações de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <Loading />
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[300px] truncate">
                        {request.description}
                      </div>
                    </TableCell>
                    <TableCell>{request.PaymentRequestType?.label}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(request.value)}
                    </TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {request.photoKey && onDownloadFile && (
                            <DropdownMenuItem
                              onClick={() => onDownloadFile(request.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Baixar Comprovante
                            </DropdownMenuItem>
                          )}

                          {request.status === "PENDING" && (
                            <DropdownMenuItem
                              onClick={() => onCancel(request.id)}
                              disabled={isPending.cancel(request.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancelar Solicitação
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.perPage}
                itemsCount={paymentRequests.length}
                onPageChange={pagination.onPageChange}
                isMobile={isMobile}
                isLoading={isLoading || isFetching}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
