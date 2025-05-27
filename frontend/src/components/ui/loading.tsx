import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

export function Loading({ size = "md", overlay = false }: LoadingProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (overlay) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow">
        <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
    </div>
  );
}
