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
import { useState } from "react";

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";
import { useDeleteSubmodule } from "./hooks/useSubmoduleMutations";
import { useSubmodules } from "./hooks/useSubmodules";

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
import { CreateSubmoduleDialog } from "./components/CreateSubmoduleDialog";
import { SubmoduleCard } from "./components/SubmoduleCard";
import { SubmoduleList } from "./components/SubmoduleList";

export default function SubmodulesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId")
    ? Number(searchParams.get("moduleId"))
    : undefined;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const deleteSubmodule = useDeleteSubmodule();

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
      moduleId: "moduleId",
    },
  });

  // Buscar dados
  const {
    submodules,
    isLoading,
    isFetching,
    isError,
    refetch,
    totalItems,
    totalPages,
    modules,
  } = useSubmodules({
    moduleId,
    page,
    perPage,
    search: debouncedSearch,
    filters,
  });

  // Handler para exclusão
  const handleDeleteSubmodule = async (id: number) => {
    await deleteSubmodule.mutateAsync(id);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Modal de criação */}
      <CreateSubmoduleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultModuleId={moduleId}
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold">Submódulos</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie todos os submódulos da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo (Dialog)
          </Button>
          <Button
            onClick={() => {
              const url = new URL(
                "/admin/submodules/new",
                window.location.origin
              );
              if (moduleId) {
                url.searchParams.set("moduleId", moduleId.toString());
              }
              router.push(url.toString());
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Submódulo
          </Button>
        </div>
      </div>

      {/* Área de filtros e controles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Todos os Submódulos</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `${totalItems} submódulos encontrados com os filtros aplicados`
                  : `${totalItems} submódulos no total`}
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
                  placeholder="Buscar submódulos..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                )}
              </div>

              {modules && modules.length > 0 && (
                <Select
                  value={moduleId?.toString() || ""}
                  onValueChange={(value) => {
                    const url = new URL(window.location.href);

                    if (value === "") {
                      url.searchParams.delete("moduleId");
                    } else {
                      url.searchParams.set("moduleId", value);
                    }

                    router.push(url.toString());
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os módulos</SelectItem>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {module.title}
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
                Ocorreu um erro ao carregar os submódulos.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : submodules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                Nenhum submódulo encontrado.
              </p>
              <Button
                onClick={() => {
                  const url = new URL(
                    "/admin/submodules/new",
                    window.location.origin
                  );
                  if (moduleId) {
                    url.searchParams.set("moduleId", moduleId.toString());
                  }
                  router.push(url.toString());
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar primeiro submódulo
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
                  {submodules.map((submodule) => (
                    <SubmoduleCard
                      key={submodule.id}
                      submodule={submodule}
                      isDeletingId={
                        deleteSubmodule.isPending
                          ? deleteSubmodule.variables || null
                          : null
                      }
                      onView={(id) => router.push(`/admin/submodules/${id}`)}
                      onEdit={(id) =>
                        router.push(`/admin/submodules/${id}/edit`)
                      }
                      onDelete={handleDeleteSubmodule}
                      onManageLessons={(id) =>
                        router.push(
                          `/admin/trainings/${submodule.module.trainingId}/modules/${submodule.moduleId}/submodules/${id}/lessons`
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <SubmoduleList
                  submodules={submodules}
                  isDeletingId={
                    deleteSubmodule.isPending
                      ? deleteSubmodule.variables || null
                      : null
                  }
                  onView={(id: number) =>
                    router.push(`/admin/submodules/${id}`)
                  }
                  onEdit={(id: number) =>
                    router.push(`/admin/submodules/${id}/edit`)
                  }
                  onDelete={handleDeleteSubmodule}
                  onManageLessons={(
                    id: number,
                    moduleId: number,
                    trainingId: number
                  ) =>
                    router.push(
                      `/admin/trainings/${trainingId}/modules/${moduleId}/submodules/${id}/lessons`
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
              itemsCount={submodules.length}
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
