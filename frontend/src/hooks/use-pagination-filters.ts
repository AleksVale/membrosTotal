import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UsePaginationFiltersProps {
  defaultPerPage?: number;
  paramMapping?: Record<string, string>;
}

export function usePaginationFilters({
  defaultPerPage = 10,
  paramMapping = {},
}: UsePaginationFiltersProps = {}) {
  const searchParams = useSearchParams();

  // Extrair parâmetros da URL
  const initialPage = Number(searchParams.get("page") || "1");
  const initialPerPage = Number(
    searchParams.get("per_page") || defaultPerPage.toString()
  );
  const initialSearch = searchParams.get("search") || "";

  // Estados
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mapa de filtros - armazena todos os filtros em um objeto
  const [filters, setFilters] = useState<Record<string, string | undefined>>(
    {}
  );

  // Atualiza um filtro específico
  const setFilter = (key: string, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (page !== 1) setPage(1); // Reset para primeira página ao filtrar
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearch("");
    setFilters({});
    setPage(1);
  };

  // Debounce para busca
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (page !== 1) setPage(1);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page, setPage]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (perPage !== defaultPerPage) params.set("per_page", perPage.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const paramKey = paramMapping[key] || key;
        params.set(paramKey, value);
      }
    });

    return params.toString() ? `?${params.toString()}` : "";
  }, [page, perPage, defaultPerPage, debouncedSearch, filters, paramMapping]);

  // Conta filtros ativos
  const activeFiltersCount = [
    debouncedSearch ? debouncedSearch : null,
    ...Object.values(filters).filter(Boolean),
  ].filter(Boolean).length;

  return {
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
    buildQueryString,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
  };
}
