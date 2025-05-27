import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { IconType } from "@/lib/types";

interface ModuleStatCardProps {
  title: string;
  value: number;
  icon: IconType;
  loading?: boolean;
}

export function ModuleStatCard({
  title,
  value,
  icon: Icon,
  loading = false,
}: ModuleStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <p className="text-2xl font-bold">Carregando...</p>
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
