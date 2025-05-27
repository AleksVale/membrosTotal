import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FilterButton } from "@/components/ui/filter-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Opções de itens por página
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface PaymentLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  filterContent: ReactNode;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

export function PaymentLayout({
  title,
  description,
  children,
  filterContent,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  perPage,
  onPerPageChange,
  onRefresh,
  isLoading,
  isFetching,
}: PaymentLayoutProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <FilterButton
            activeFiltersCount={activeFiltersCount}
            onClick={() => setShowFilters(!showFilters)}
            isActive={showFilters}
          />

          <Select
            value={perPage.toString()}
            onValueChange={(value) => onPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={`${perPage} por página`} />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading || isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading || isFetching ? "animate-spin" : ""
              }`}
            />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-sm text-primary">
                ({activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}{" "}
                ativo{activeFiltersCount > 1 ? "s" : ""})
              </span>
            )}
          </CardDescription>

          {/* Filtros */}
          {filterContent}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
}
