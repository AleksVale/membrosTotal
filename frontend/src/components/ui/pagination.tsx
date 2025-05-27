import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemsCount: number;
  onPageChange: (page: number) => void;
  isMobile: boolean;
  isLoading: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemsCount,
  onPageChange,
  isMobile,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Mostrando {itemsCount} de {totalItems} itens
        {itemsPerPage !== 10 && ` (${itemsPerPage} por página)`}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from(
            { length: Math.min(isMobile ? 3 : 5, totalPages) },
            (_, i) => {
              const pageNumber = isMobile
                ? currentPage <= 2
                  ? i + 1
                  : currentPage >= totalPages - 1
                  ? totalPages - 2 + i
                  : currentPage - 1 + i
                : currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                ? totalPages - 4 + i
                : currentPage - 2 + i;

              return pageNumber <= totalPages ? (
                <Button
                  key={i}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  disabled={isLoading}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima página</span>
        </Button>
      </div>
    </div>
  );
}
