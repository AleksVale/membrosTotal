"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  href?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  href,
  trend,
  progress,
  badge,
  className = "",
}: StatCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-md ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badge.variant || "default"} className="text-xs">
              {badge.text}
            </Badge>
          )}
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-2xl font-bold tracking-tight">{value}</div>

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}

          {trend && (
            <div className="flex items-center text-xs">
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span
                className={trend.isPositive ? "text-green-600" : "text-red-600"}
              >
                {trend.value}%
              </span>
              <span className="ml-1 text-muted-foreground">{trend.label}</span>
            </div>
          )}

          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{progress.label}</span>
                <span className="font-medium">
                  {progress.value}/{progress.max}
                </span>
              </div>
              <Progress
                value={(progress.value / progress.max) * 100}
                className="h-2"
              />
            </div>
          )}

          {href && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full justify-between mt-3 text-xs h-8"
            >
              <Link href={href}>
                Ver detalhes
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
