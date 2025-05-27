import { Badge } from "@/components/ui/badge";

type PaymentStatus = "PENDING" | "PAID" | "CANCELLED";

interface StatusBadgeProps {
  status: PaymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "PAID"
      ? "default"
      : status === "CANCELLED"
      ? "destructive"
      : "secondary";

  const label =
    status === "PAID"
      ? "Pago"
      : status === "CANCELLED"
      ? "Cancelado"
      : "Pendente";

  return <Badge variant={variant}>{label}</Badge>;
}
