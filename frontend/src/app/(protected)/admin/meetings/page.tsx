"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/use-media-query";
import http from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Search,
  Video,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Meeting {
  id: number;
  title: string;
  description: string;
  date: string;
  link: string;
  status: string;
  UserMeeting: {
    User: {
      id: number;
      firstName: string;
      lastName: string;
    };
  }[];
}

interface MeetingsResponse {
  data: Meeting[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function MeetingsPage() {
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

  // Fetch meetings with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["meetings", page, debouncedSearch],
    queryFn: async () => {
      const response = await http.get<MeetingsResponse>("/meetings", {
        params: {
          page,
          per_page: 10,
          title: debouncedSearch,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete meeting mutation
  const deleteMeetingMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/meetings/${id}`),
    onSuccess: () => {
      toast.success("Reunião removida com sucesso");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: () => {
      toast.error("Não foi possível remover a reunião");
    },
  });

  // Finish meeting mutation
  const finishMeetingMutation = useMutation({
    mutationFn: (id: number) =>
      http.patch(`/meetings/${id}`, { status: "DONE" }),
    onSuccess: () => {
      toast.success("Reunião finalizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: () => {
      toast.error("Não foi possível finalizar a reunião");
    },
  });

  const handleDelete = (id: number) => {
    deleteMeetingMutation.mutate(id);
  };

  const handleFinish = (id: number) => {
    finishMeetingMutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const meetings = data?.data || [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.per_page)
    : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie as reuniões do sistema
          </p>
        </div>
        <Button onClick={() => router.push("/admin/meetings/new")}>
          <Video className="mr-2 h-4 w-4" />
          Nova Reunião
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reuniões</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as reuniões do sistema
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reuniões..."
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
              Erro ao carregar reuniões. Tente novamente.
            </div>
          ) : (
            <>
              {isMobile ? (
                // Layout Mobile (cards)
                <div className="space-y-4">
                  {meetings.length === 0 ? (
                    <div className="text-center py-6">
                      Nenhuma reunião encontrada
                    </div>
                  ) : (
                    meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{meeting.title}</h3>
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
                                    `/admin/meetings/${meeting.id}/edit`
                                  )
                                }
                              >
                                Editar
                              </DropdownMenuItem>
                              {meeting.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => handleFinish(meeting.id)}
                                  disabled={
                                    finishMeetingMutation.isPending &&
                                    finishMeetingMutation.variables ===
                                      meeting.id
                                  }
                                >
                                  {finishMeetingMutation.isPending &&
                                  finishMeetingMutation.variables ===
                                    meeting.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Finalizando...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Finalizar
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Remover
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir reunião
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. Tem
                                      certeza de que deseja excluir esta
                                      reunião?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(meeting.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {deleteMeetingMutation.isPending &&
                                      deleteMeetingMutation.variables ===
                                        meeting.id ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Removendo...
                                        </>
                                      ) : (
                                        "Remover"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {meeting.description}
                        </p>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(
                              new Date(meeting.date),
                              "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                              {
                                locale: ptBR,
                              }
                            )}
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Status:
                            </span>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  meeting.status === "DONE"
                                    ? "default"
                                    : meeting.status === "CANCELED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {meeting.status === "DONE"
                                  ? "Finalizada"
                                  : meeting.status === "CANCELED"
                                  ? "Cancelada"
                                  : "Pendente"}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Participantes:
                            </span>
                            <div className="mt-1">
                              {meeting.UserMeeting.map((userMeeting) => (
                                <div key={userMeeting.User.id}>
                                  {userMeeting.User?.firstName || ""}{" "}
                                  {userMeeting.User?.lastName || ""}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <a
                              href={meeting.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Link da reunião
                            </a>
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
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Nenhuma reunião encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      meetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <p className="font-medium">{meeting.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {meeting.description}
                              </p>
                              <a
                                href={meeting.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                              >
                                Link da reunião
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* TODO: Fix date UTC */}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(
                                meeting.date,
                                "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                                {
                                  locale: ptBR,
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {meeting.UserMeeting.map((userMeeting) => (
                                <span key={userMeeting.User.id}>
                                  {userMeeting.User?.firstName || ""}{" "}
                                  {userMeeting.User?.lastName || ""}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                meeting.status === "DONE"
                                  ? "default"
                                  : meeting.status === "CANCELED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {meeting.status === "DONE"
                                ? "Finalizada"
                                : meeting.status === "CANCELED"
                                ? "Cancelada"
                                : "Pendente"}
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
                                    router.push(
                                      `/admin/meetings/${meeting.id}/edit`
                                    )
                                  }
                                >
                                  Editar
                                </DropdownMenuItem>
                                {meeting.status === "PENDING" && (
                                  <DropdownMenuItem
                                    onClick={() => handleFinish(meeting.id)}
                                    disabled={
                                      finishMeetingMutation.isPending &&
                                      finishMeetingMutation.variables ===
                                        meeting.id
                                    }
                                  >
                                    {finishMeetingMutation.isPending &&
                                    finishMeetingMutation.variables ===
                                      meeting.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Finalizando...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Finalizar
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Remover
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Excluir reunião
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Tem
                                        certeza de que deseja excluir esta
                                        reunião?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(meeting.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {deleteMeetingMutation.isPending &&
                                        deleteMeetingMutation.variables ===
                                          meeting.id ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Removendo...
                                          </>
                                        ) : (
                                          "Remover"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {meetings.length} de {data?.meta?.total || 0}{" "}
                  reuniões
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
