"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, MoreHorizontal, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/payments/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Payment {
  id: number;
  description: string;
  value: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  photoKey?: string;
  PaymentType?: {
    id: number;
    label: string;
  };
}

interface PaymentListProps {
  payments: Payment[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onCancel?: (id: number, reason: string) => void;
  onDownloadFile?: (id: number) => void;
  isPending?: {
    cancel?: (id: number) => boolean;
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

export function PaymentList({
  payments,
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
}: PaymentListProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar os pagamentos.
        </p>
        <Button onClick={onRefetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {hasActiveFilters
            ? "Nenhum pagamento encontrado com os filtros aplicados"
            : "Você ainda não tem pagamentos"}
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

  const handleCancelClick = (id: number) => {
    setSelectedPaymentId(id);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedPaymentId && onCancel) {
      onCancel(selectedPaymentId, cancelReason);
      setCancelDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meus Pagamentos</CardTitle>
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
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-[300px] truncate">
                          {payment.description}
                        </div>
                      </TableCell>
                      <TableCell>{payment.PaymentType?.label}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.value)}
                      </TableCell>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {payment.photoKey && onDownloadFile && (
                              <DropdownMenuItem
                                onClick={() => onDownloadFile(payment.id)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Comprovante
                              </DropdownMenuItem>
                            )}

                            {payment.status === "PENDING" && onCancel && (
                              <DropdownMenuItem
                                onClick={() => handleCancelClick(payment.id)}
                                className="text-destructive"
                                disabled={
                                  isPending?.cancel &&
                                  isPending.cancel(payment.id)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancelar Pagamento
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
                  itemsCount={payments.length}
                  onPageChange={pagination.onPageChange}
                  isMobile={isMobile}
                  isLoading={isLoading || isFetching}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Pagamento</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo do cancelamento do pagamento.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo do cancelamento"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={!cancelReason.trim()}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
