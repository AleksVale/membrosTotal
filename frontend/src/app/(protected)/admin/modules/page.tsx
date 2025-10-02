"use client";

import {
  Grid,
  List,
  ListFilter,
  Loader2,
  PlusCircle,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";
import { useModules } from "./hooks/useModules";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/lib/http";
import { CreateModuleDialog } from "./components/CreateModuleDialog";
import { ModuleCard } from "./components/ModuleCard";
import { ModuleList } from "./components/ModuleList";

function ModulesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingId = searchParams.get("trainingId")
    ? Number(searchParams.get("trainingId"))
    : undefined;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filtros e paginação
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
    clearFilters,
    activeFiltersCount,
    hasActiveFilters,
  } = usePaginationFilters({
    defaultPerPage: 12,
    paramMapping: {
      trainingId: "trainingId",
    },
  });

  // Buscar dados
  const {
    modules,
    isLoading,
    isFetching,
    isError,
    refetch,
    totalItems,
    totalPages,
    trainings,
  } = useModules({
    trainingId,
    page,
    perPage,
    search: debouncedSearch,
    filters,
  });

  // Handler para exclusão com estado de loading e melhor tratamento de erros

  const handleDeleteModule = async (id: number) => {
    try {
      await http.delete(`/training-modules-admin/${id}`);

      // Notificação de sucesso
      toast.success("Módulo excluído com sucesso");

      // Atualiza a lista
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
      toast.error("Erro ao excluir o módulo. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Modal de criação */}
      <CreateModuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultTrainingId={trainingId}
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold">Módulos</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie todos os módulos da plataforma
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Módulo
        </Button>
      </div>

      {/* Área de filtros e controles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Todos os Módulos</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `${totalItems} módulos encontrados com os filtros aplicados`
                  : `${totalItems} módulos no total`}
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <ListFilter className="h-4 w-4 mr-1" />
                Filtros
                {hasActiveFilters && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    variant="destructive"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Select
                value={perPage.toString()}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 itens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 itens</SelectItem>
                  <SelectItem value="12">12 itens</SelectItem>
                  <SelectItem value="24">24 itens</SelectItem>
                  <SelectItem value="48">48 itens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t pt-3 pb-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar módulos..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                )}
              </div>

              {trainings && trainings.length > 0 && (
                <Select
                  value={trainingId?.toString() || ""}
                  onValueChange={(value) => {
                    const url = new URL(window.location.href);

                    if (value === "") {
                      url.searchParams.delete("trainingId");
                    } else {
                      url.searchParams.set("trainingId", value);
                    }

                    router.push(url.toString());
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por treinamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os treinamentos</SelectItem>
                    {trainings.map((training) => (
                      <SelectItem
                        key={training.id}
                        value={training.id.toString()}
                      >
                        {training.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-fit h-10"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        )}

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">
                Ocorreu um erro ao carregar os módulos.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                Nenhum módulo encontrado.
              </p>
              <Button
                onClick={() => {
                  const url = new URL(
                    "/admin/trainings/modules/new",
                    window.location.origin
                  );
                  if (trainingId) {
                    url.searchParams.set("trainingId", trainingId.toString());
                  }
                  router.push(url.toString());
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar primeiro módulo
              </Button>
            </div>
          ) : (
            <div className="relative">
              {isFetching && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {modules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      onView={(id) => router.push(`/admin/modules/${id}`)}
                      onEdit={(id) => router.push(`/admin/modules/${id}/edit`)}
                      onDelete={handleDeleteModule}
                      onManageSubmodules={(id) =>
                        router.push(
                          `/admin/trainings/${module.trainingId}/modules/${id}/submodules`
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <ModuleList
                  modules={modules}
                  onView={(id) => router.push(`/admin/modules/${id}`)}
                  onEdit={(id) => router.push(`/admin/modules/${id}/edit`)}
                  onDelete={handleDeleteModule}
                  onManageSubmodules={(id, trainingId) =>
                    router.push(
                      `/admin/trainings/${trainingId}/modules/${id}/submodules`
                    )
                  }
                />
              )}
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={perPage}
              itemsCount={modules.length}
              onPageChange={setPage}
              isMobile={false}
              isLoading={isLoading || isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ModulesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ModulesListPage />
    </Suspense>
  );
}
