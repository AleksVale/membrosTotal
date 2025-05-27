import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { cva } from "class-variance-authority";

const iconVariants = cva("h-5 w-5", {
  variants: {
    variant: {
      total: "text-blue-500",
      students: "text-green-500",
      active: "text-purple-500",
      draft: "text-amber-500",
    },
  },
  defaultVariants: {
    variant: "total",
  },
});

interface TrainingStatCardProps {
  title: string;
  value: number;
  icon: string;
  loading?: boolean;
}

export function TrainingStatCard({
  title,
  value,
  icon,
  loading = false,
}: TrainingStatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "graduation-cap":
        return <GraduationCap className={iconVariants({ variant: "total" })} />;
      case "users":
        return <Users className={iconVariants({ variant: "students" })} />;
      case "check-circle":
        return <CheckCircle className={iconVariants({ variant: "active" })} />;
      case "clock":
        return <Clock className={iconVariants({ variant: "draft" })} />;
      default:
        return <GraduationCap className={iconVariants({ variant: "total" })} />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}
