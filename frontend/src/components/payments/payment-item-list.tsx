import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { StatusBadge } from "@/components/payments/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface PaymentItemListProps<T> {
  title: string;
  items: T[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onPay: (id: number, reason?: string, file?: File | null) => void;
  onCancel: (id: number, reason: string) => void;
  onDownloadFile: (id: number) => void;
  isPending: {
    pay: (id: number) => boolean;
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
  getItemProps: (item: T) => {
    id: number;
    description: string;
    value: number;
    userFullName: string;
    categoryLabel: string | undefined;
    status: "PENDING" | "PAID" | "CANCELLED";
    createdAt: string;
    photoKey?: string;
  };
  emptyMessage?: string;
  filterEmptyMessage?: string;
}

// Tipo para controle do dialog
type DialogType = "PAY" | "CANCEL" | null;

export function PaymentItemList<T>({
  items,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onPay,
  onCancel,
  onDownloadFile,
  isPending,
  hasActiveFilters,
  isMobile,
  pagination,
  getItemProps,
  emptyMessage = "Nenhum item disponível",
  filterEmptyMessage = "Nenhum item encontrado com os filtros aplicados",
}: PaymentItemListProps<T>) {
  // Constantes
  const TABLE_COLUMN_COUNT = 7; // Descrição, Valor, Usuário, Categoria, Status, Data, Ações

  // Estados unificados para controle do dialog
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // ==================== HANDLERS PARA AÇÕES DO USUÁRIO ====================

  const handlePayClick = (id: number) => {
    setSelectedItemId(id);
    setReason("");
    setFile(null);
    setDialogType("PAY");
  };

  const handleCancelClick = (id: number) => {
    setSelectedItemId(id);
    setReason("");
    setDialogType("CANCEL");
  };

  const handleDialogClose = (open: boolean) => {
    console.log(open);
    if (!open) {
      setDialogType(null);
      setSelectedItemId(null);
      setReason("");
      setFile(null);
    }
  };

  const handleConfirmPay = () => {
    if (!reason.trim()) {
      toast.error("Por favor, insira uma descrição");
      return;
    }

    if (selectedItemId && reason.trim()) {
      onPay(selectedItemId, reason, file);
      handleDialogClose(false);
    }
  };

  const handleConfirmCancel = () => {
    if (!reason.trim()) {
      toast.error("Por favor, informe o motivo do cancelamento");
      return;
    }

    if (selectedItemId && reason.trim()) {
      onCancel(selectedItemId, reason);
      handleDialogClose(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ==================== FUNÇÕES UTILITÁRIAS ====================

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // ==================== ESTADOS DE CARREGAMENTO E ERRO ====================

  if (isLoading && items.length === 0) {
    return <Loading size={22} />;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Erro ao carregar dados.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          className="mt-2"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  // ==================== COMPONENTES DE RENDERIZAÇÃO ====================

  const renderEmptyState = () => (
    <div className="text-center py-6">
      {hasActiveFilters ? filterEmptyMessage : emptyMessage}
    </div>
  );

  const renderItemActions = (item: ReturnType<typeof getItemProps>) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Baixar arquivo (se disponível) */}
        {item.photoKey && (
          <DropdownMenuItem onClick={() => onDownloadFile(item.id)}>
            Baixar Arquivo
          </DropdownMenuItem>
        )}

        {/* Ações para itens pendentes */}
        {item.status === "PENDING" && (
          <>
            <DropdownMenuItem
              onClick={() => handlePayClick(item.id)}
              disabled={isPending.pay(item.id)}
            >
              {isPending.pay(item.id)
                ? "Processando..."
                : "Confirmar Pagamento"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleCancelClick(item.id)}
              disabled={isPending.cancel(item.id)}
              className="text-red-600"
            >
              {isPending.cancel(item.id)
                ? "Processando..."
                : "Cancelar Reembolso"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ==================== RENDERIZAÇÃO PRINCIPAL ====================

  return (
    <>
      <Dialog open={dialogType !== null} onOpenChange={handleDialogClose}>
        {/* Indicador de carregamento sobreposto quando estiver refetchando */}
        {isFetching && items.length > 0 && <Loading size={22} />}

        {isMobile ? (
          // Layout Mobile (cards)
          <div className="space-y-4">
            {items.length === 0
              ? renderEmptyState()
              : items.map((item) => {
                  const props = getItemProps(item);
                  return (
                    <div
                      key={props.id}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate">
                          {props.description}
                        </h3>
                        {renderItemActions(props)}
                      </div>

                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <div>{formatCurrency(props.value)}</div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div>
                          <StatusBadge status={props.status} />
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Usuário:</span>
                        <div>{props.userFullName}</div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          Categoria:
                        </span>
                        <div>{props.categoryLabel || "N/A"}</div>
                      </div>

                      <div className="col-span-2">
                        <span className="text-muted-foreground">Data:</span>
                        <div>{formatDate(props.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
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
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={TABLE_COLUMN_COUNT}
                      className="text-center py-6"
                    >
                      {hasActiveFilters ? filterEmptyMessage : emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => {
                    const props = getItemProps(item);
                    return (
                      <TableRow key={props.id}>
                        <TableCell className="max-w-[200px] truncate">
                          {props.description}
                        </TableCell>
                        <TableCell>{formatCurrency(props.value)}</TableCell>
                        <TableCell>{props.userFullName}</TableCell>
                        <TableCell>{props.categoryLabel || "N/A"}</TableCell>
                        <TableCell>
                          <StatusBadge status={props.status} />
                        </TableCell>
                        <TableCell>{formatDate(props.createdAt)}</TableCell>
                        <TableCell>{renderItemActions(props)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog único com renderização condicional */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "PAY"
                ? "Confirmar Pagamento"
                : "Cancelar Reembolso"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "PAY"
                ? "Confirme o pagamento deste reembolso."
                : "Esta ação não poderá ser desfeita. Informe o motivo do cancelamento."}
            </DialogDescription>
          </DialogHeader>

          {dialogType === "PAY" ? (
            // Conteúdo para confirmar pagamento
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pay-reason">Descrição do pagamento</Label>
                <Textarea
                  id="pay-reason"
                  placeholder="Informe detalhes sobre o pagamento realizado"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px]"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay-file">Comprovante (opcional)</Label>
                <Input
                  id="pay-file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
              </div>
            </div>
          ) : (
            // Conteúdo para cancelar reembolso
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Motivo do cancelamento</Label>
              <Input
                id="cancel-reason"
                placeholder="Informe o motivo do cancelamento"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              {dialogType === "PAY" ? "Cancelar" : "Voltar"}
            </Button>
            <Button
              variant={dialogType === "PAY" ? "default" : "destructive"}
              onClick={
                dialogType === "PAY" ? handleConfirmPay : handleConfirmCancel
              }
              disabled={
                !reason.trim() ||
                (selectedItemId
                  ? dialogType === "PAY"
                    ? isPending.pay(selectedItemId)
                    : isPending.cancel(selectedItemId)
                  : false)
              }
            >
              {dialogType === "PAY" ? "Confirmar" : "Cancelar Reembolso"}
            </Button>
          </DialogFooter>
        </DialogContent>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.perPage}
          itemsCount={items.length}
          onPageChange={pagination.onPageChange}
          isMobile={isMobile}
          isLoading={isLoading || isFetching}
        />
      </Dialog>
    </>
  );
}
