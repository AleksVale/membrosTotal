import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "PENDING" | "PAID" | "CANCELLED" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "Pendente";
      case "PAID":
        return "Pago";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border-0", getVariant(status), className)}
    >
      {getLabel(status)}
    </Badge>
  );
}
