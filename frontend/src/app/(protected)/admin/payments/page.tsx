"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  MoreHorizontal,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import http from "@/lib/http";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Payment {
  id: number;
  description: string;
  value: number;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch payments with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", page, debouncedSearch],
    queryFn: async () => {
      const response = await http.get<PaymentsResponse>("/payment-admin", {
        params: {
          page,
          per_page: 10,
          description: debouncedSearch,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/payment-admin/${id}`),
    onSuccess: () => {
      toast.success("Pagamento removido com sucesso");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
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
      queryClient.invalidateQueries({ queryKey: ["payments"] });
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const payments = data?.data || [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.per_page)
    : 1;

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pagamentos do sistema
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamentos..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar pagamentos. Tente novamente.
            </div>
          ) : (
            <>
              {isMobile ? (
                // Layout Mobile (cards)
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-6">
                      Nenhum pagamento encontrado
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">
                            {payment.description}
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
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/admin/payments/${payment.id}/edit`
                                  )
                                }
                              >
                                Editar
                              </DropdownMenuItem>
                              {payment.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => handlePay(payment.id)}
                                  disabled={
                                    payPaymentMutation.isPending &&
                                    payPaymentMutation.variables === payment.id
                                  }
                                >
                                  {payPaymentMutation.isPending &&
                                  payPaymentMutation.variables ===
                                    payment.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processando...
                                    </>
                                  ) : (
                                    "Realizar Pagamento"
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(payment.id)}
                                className="text-red-600"
                                disabled={
                                  deletePaymentMutation.isPending &&
                                  deletePaymentMutation.variables === payment.id
                                }
                              >
                                {deletePaymentMutation.isPending &&
                                deletePaymentMutation.variables ===
                                  payment.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Removendo...
                                  </>
                                ) : (
                                  "Remover"
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Valor:
                            </span>
                            <div className="font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(payment.value)}
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Status:
                            </span>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  payment.status === "PAID"
                                    ? "default"
                                    : payment.status === "CANCELLED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {payment.status === "PAID"
                                  ? "Pago"
                                  : payment.status === "CANCELLED"
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
                              {payment.user.firstName} {payment.user.lastName}
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <div>{payment.paymentType.name}</div>
                          </div>

                          <div className="col-span-2">
                            <span className="text-muted-foreground">Data:</span>
                            <div>
                              {format(
                                new Date(payment.createdAt),
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: ptBR }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Layout Desktop (tabela)
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Nenhum pagamento encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="max-w-[200px] truncate">
                            {payment.description}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(payment.value)}
                          </TableCell>
                          <TableCell>
                            {payment.user.firstName} {payment.user.lastName}
                          </TableCell>
                          <TableCell>{payment.paymentType.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "PAID"
                                  ? "default"
                                  : payment.status === "CANCELLED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {payment.status === "PAID"
                                ? "Pago"
                                : payment.status === "CANCELLED"
                                ? "Cancelado"
                                : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(payment.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/admin/payments/${payment.id}/edit`
                                    )
                                  }
                                >
                                  Editar
                                </DropdownMenuItem>
                                {payment.status === "PENDING" && (
                                  <DropdownMenuItem
                                    onClick={() => handlePay(payment.id)}
                                    disabled={
                                      payPaymentMutation.isPending &&
                                      payPaymentMutation.variables ===
                                        payment.id
                                    }
                                  >
                                    {payPaymentMutation.isPending &&
                                    payPaymentMutation.variables ===
                                      payment.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processando...
                                      </>
                                    ) : (
                                      "Realizar Pagamento"
                                    )}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDelete(payment.id)}
                                  className="text-red-600"
                                  disabled={
                                    deletePaymentMutation.isPending &&
                                    deletePaymentMutation.variables ===
                                      payment.id
                                  }
                                >
                                  {deletePaymentMutation.isPending &&
                                  deletePaymentMutation.variables ===
                                    payment.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Removendo...
                                    </>
                                  ) : (
                                    "Remover"
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {payments.length} de {data?.meta?.total || 0}{" "}
                  pagamentos
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isLoading}
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
                            key={pageNumber}
                            variant={
                              pageNumber === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={isLoading}
                            className="w-8 h-8"
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
                    disabled={page === totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
