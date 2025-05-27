import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
  isActive: boolean;
}

export function FilterButton({
  activeFiltersCount,
  onClick,
  isActive,
}: FilterButtonProps) {
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="relative"
    >
      <Filter className="h-4 w-4 mr-1" />
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
  );
}
