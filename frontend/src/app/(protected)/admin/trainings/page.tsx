"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  ListFilter,
  Grid,
  List,
  Search,
  Loader2,
} from "lucide-react";

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";
import { useTrainings } from "./hooks/useTrainings";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrainingCard } from "./components/TrainingCard";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { TrainingStatCard } from "./components/TrainingStatCard";
import { TrainingList } from "./components/TrainingList";

export default function TrainingsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    setFilter,
    clearFilters,
    activeFiltersCount,
    hasActiveFilters,
  } = usePaginationFilters({
    defaultPerPage: 12, // Mais itens para o grid
    paramMapping: {
      status: "status",
      tutorId: "tutorId",
    },
  });

  // Buscar dados
  const {
    trainings,
    isLoading,
    isFetching,
    isError,
    refetch,
    totalItems,
    totalPages,
    stats,
  } = useTrainings({
    page,
    perPage,
    search: debouncedSearch,
    filters,
  });

  // Estatísticas resumidas
  const trainingsStats = useMemo(
    () => [
      {
        title: "Total de Treinamentos",
        value: stats.total || totalItems,
        status: "total",
        icon: "graduation-cap",
      },
      {
        title: "Alunos Matriculados",
        value: stats.students || 0,
        status: "students",
        icon: "users",
      },
      {
        title: "Treinamentos Ativos",
        value: stats.active || 0,
        status: "active",
        icon: "check-circle",
      },
      {
        title: "Aguardando Publicação",
        value: stats.draft || 0,
        status: "draft",
        icon: "clock",
      },
    ],
    [stats, totalItems]
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Cabeçalho e ações principais */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treinamentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os treinamentos da plataforma
          </p>
        </div>
        <Button onClick={() => router.push("/admin/trainings/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Treinamento
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {trainingsStats.map((stat) => (
          <TrainingStatCard
            key={stat.status}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Área de filtros e controles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Todos os Treinamentos</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `${totalItems} treinamentos encontrados com os filtros aplicados`
                  : `${totalItems} treinamentos no total`}
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
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder={`${perPage} por página`} />
                </SelectTrigger>
                <SelectContent>
                  {[12, 24, 36, 48].map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Área de filtros expansível */}
          {showFilters && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar treinamentos..."
                  className={`pl-8 ${search ? "border-primary" : ""}`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                )}
              </div>

              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) =>
                  setFilter("status", value === "ALL" ? undefined : value)
                }
              >
                <SelectTrigger
                  className={`w-full ${filters.status ? "border-primary" : ""}`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os status</SelectItem>
                  <SelectItem value="ACTIVE">Ativos</SelectItem>
                  <SelectItem value="DRAFT">Rascunhos</SelectItem>
                  <SelectItem value="ARCHIVED">Arquivados</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="md:justify-self-end"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        {/* Conteúdo - Grid ou Lista */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500">
                Não foi possível carregar os treinamentos
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : trainings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "Nenhum treinamento encontrado com os filtros aplicados"
                  : "Nenhum treinamento cadastrado ainda"}
              </p>
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpar filtros
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/admin/trainings/new")}
                  className="mt-4"
                >
                  Criar primeiro treinamento
                </Button>
              )}
            </div>
          ) : (
            <div className="relative">
              {isFetching && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trainings.map((training) => (
                    <TrainingCard
                      key={training.id}
                      training={training}
                      onView={(id) => router.push(`/admin/trainings/${id}`)}
                      onEdit={(id) =>
                        router.push(`/admin/trainings/${id}/edit`)
                      }
                    />
                  ))}
                </div>
              ) : (
                <TrainingList
                  trainings={trainings}
                  onView={(id) => router.push(`/admin/trainings/${id}`)}
                  onEdit={(id) => router.push(`/admin/trainings/${id}/edit`)}
                  onDelete={() => refetch()}
                />
              )}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={perPage}
              itemsCount={trainings.length}
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
