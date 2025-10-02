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

// Custom hooks
import { usePaginationFilters } from "@/hooks/use-pagination-filters";
import { useDeleteLesson } from "./hooks/useLessonMutations";
import { useLessons } from "./hooks/useLessons";

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
import { LessonCard } from "./components/LessonCard";
import { LessonList } from "./components/LessonList";

function LessonsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submoduleId = searchParams.get("submoduleId")
    ? Number(searchParams.get("submoduleId"))
    : undefined;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const deleteLesson = useDeleteLesson();

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
      submoduleId: "submoduleId",
    },
  });

  // Buscar dados
  const { data, isLoading, isFetching, isError, refetch } = useLessons({
    submoduleId,
    page,
    perPage,
    search: debouncedSearch,
    filters,
  });

  const lessons = data?.lessons || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

  // Handler para exclusão
  const handleDeleteLesson = async (id: number) => {
    await deleteLesson.mutateAsync(id);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold">Aulas</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie todas as aulas da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const url = new URL("/admin/lessons/new", window.location.origin);
              if (submoduleId) {
                url.searchParams.set("submoduleId", submoduleId.toString());
              }
              router.push(url.toString());
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
        </div>
      </div>

      {/* Área de filtros e controles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Todas as Aulas</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `${totalItems} aulas encontradas com os filtros aplicados`
                  : `${totalItems} aulas no total`}
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
                  placeholder="Buscar aulas..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                )}
              </div>

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
                Ocorreu um erro ao carregar as aulas.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                Nenhuma aula encontrada.
              </p>
              <Button
                onClick={() => {
                  const url = new URL(
                    "/admin/lessons/new",
                    window.location.origin
                  );
                  if (submoduleId) {
                    url.searchParams.set("submoduleId", submoduleId.toString());
                  }
                  router.push(url.toString());
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar primeira aula
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isDeletingId={
                        deleteLesson.isPending
                          ? deleteLesson.variables || null
                          : null
                      }
                      onView={(id) => router.push(`/admin/lessons/${id}`)}
                      onEdit={(id) => router.push(`/admin/lessons/${id}/edit`)}
                      onDelete={handleDeleteLesson}
                    />
                  ))}
                </div>
              ) : (
                <LessonList
                  lessons={lessons}
                  onDelete={handleDeleteLesson}
                  isDeleting={deleteLesson.isPending}
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
              itemsCount={lessons.length}
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

export default function LessonsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LessonsListPage />
    </Suspense>
  );
}
