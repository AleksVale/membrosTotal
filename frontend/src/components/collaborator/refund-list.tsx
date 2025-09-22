"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, MoreHorizontal } from "lucide-react";

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

interface Refund {
  id: number;
  description: string;
  value: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  photoKey?: string;
  RefundType?: {
    id: number;
    label: string;
  };
}

interface RefundListProps {
  refunds: Refund[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onDownloadFile?: (id: number) => void;
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

export function RefundList({
  refunds,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onDownloadFile,
  hasActiveFilters,
  isMobile,
  pagination,
}: RefundListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar os reembolsos.
        </p>
        <Button onClick={onRefetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {hasActiveFilters
            ? "Nenhum reembolso encontrado com os filtros aplicados"
            : "Você ainda não tem reembolsos"}
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
        <CardTitle>Meus Reembolsos</CardTitle>
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
                {refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[300px] truncate">
                        {refund.description}
                      </div>
                    </TableCell>
                    <TableCell>{refund.RefundType?.label}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(refund.value)}
                    </TableCell>
                    <TableCell>{formatDate(refund.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={refund.status} />
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

                          {refund.photoKey && onDownloadFile && (
                            <DropdownMenuItem
                              onClick={() => onDownloadFile(refund.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Baixar Comprovante
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
                itemsCount={refunds.length}
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
