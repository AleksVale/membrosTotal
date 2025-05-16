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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import http from "@/lib/http";
import { toast } from "react-toastify";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
  Profile: {
    id: number;
    name: string;
    label: string;
  };
  status: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: async () => {
      const response = await http.get<UsersResponse>("/user", {
        params: {
          page,
          per_page: 10,
          name: debouncedSearch,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/user/${id}`),
    onSuccess: () => {
      toast.success("Usuário removido com sucesso");
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Não foi possível remover o usuário");
    },
  });

  const handleDelete = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const users = data?.data || [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.per_page)
    : 1;

  // Adicione este hook para detectar se estamos em uma tela móvel
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button asChild className="flex items-center">
          <Link href="/admin/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários do sistema
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
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
              Erro ao carregar usuários. Tente novamente.
            </div>
          ) : (
            <>
              {isMobile ? (
                // Layout Mobile (cards)
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-6">
                      Nenhum usuário encontrado
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
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
                                  router.push(`/admin/users/${user.id}`)
                                }
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600"
                                disabled={deleteUserMutation.isPending}
                              >
                                {deleteUserMutation.isPending &&
                                deleteUserMutation.variables === user.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                              Perfil:
                            </span>
                            <div className="mt-1">
                              <Badge variant="outline">
                                {user.Profile.label}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Status:
                            </span>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  user.status === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="text-muted-foreground">CPF:</span>
                            <div className="mt-1">{user.document}</div>
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
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        // Tabela original aqui
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.document}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.Profile.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                            </Badge>
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
                                    router.push(`/admin/users/${user.id}`)
                                  }
                                >
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-600"
                                  disabled={deleteUserMutation.isPending}
                                >
                                  {deleteUserMutation.isPending &&
                                  deleteUserMutation.variables === user.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

              {/* Paginação (adapte para mobile) */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {users.length} de {data?.meta?.total || 0} usuários
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

                  {/* Mostrar menos botões de página em dispositivos móveis */}
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
