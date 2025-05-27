import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/payments/status-badge";
import { PaymentDialog } from "@/components/payments/payment-dialog";
import { CancelPaymentDialog } from "@/components/payments/cancel-payment-dialog";
import { Loading } from "@/components/ui/loading";
import { Pagination } from "@/components/ui/pagination";

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
  if (isLoading && items.length === 0) {
    return <Loading size="lg" />;
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
        {item.photoKey && (
          <DropdownMenuItem onClick={() => onDownloadFile(item.id)}>
            Baixar Arquivo
          </DropdownMenuItem>
        )}
        {item.status === "PENDING" && (
          <>
            <PaymentDialog
              paymentId={item.id}
              onPay={onPay}
              isPending={isPending.pay(item.id)}
            />
            <DropdownMenuSeparator />
            <CancelPaymentDialog
              paymentId={item.id}
              onCancel={onCancel}
              isPending={isPending.cancel(item.id)}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <>
      {/* Indicador de carregamento sobreposto quando estiver refetchando */}
      {isFetching && items.length > 0 && <Loading size="md" overlay />}

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
                      <span className="text-muted-foreground">Categoria:</span>
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
                  <TableCell colSpan={7} className="text-center py-6">
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
    </>
  );
}
