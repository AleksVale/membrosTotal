import { ReactNode } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentFiltersProps {
  showFilters: boolean;
  isMobile: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  children?: ReactNode;
}

export function PaymentFilters({
  showFilters,
  isMobile,
  search,
  onSearchChange,
  isSearching,
  hasActiveFilters,
  onClearFilters,
  children,
}: PaymentFiltersProps) {
  if (!showFilters && !isMobile) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          className={`pl-8 ${search ? "border-primary" : ""}`}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {isSearching && (
          <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
        )}
      </div>

      {children}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
