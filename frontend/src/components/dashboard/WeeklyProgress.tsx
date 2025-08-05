"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";

interface DayProgress {
  day: string;
  shortDay: string;
  completed: number;
  total: number;
  isToday: boolean;
}

interface WeeklyProgressProps {
  className?: string;
}

export function WeeklyProgress({ className = "" }: WeeklyProgressProps) {
  const getCurrentWeek = (): DayProgress[] => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1); // Começar na segunda-feira

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();

      // Dados simulados para demonstração
      let completed = 0;
      let total = 5;

      if (date < today) {
        // Dias passados - valores aleatórios de exemplo
        completed = Math.floor(Math.random() * 5) + 1;
      } else if (isToday) {
        // Hoje - progresso parcial
        completed = 2;
      }

      weekDays.push({
        day: date.toLocaleDateString("pt-BR", { weekday: "long" }),
        shortDay: date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .slice(0, 3),
        completed,
        total,
        isToday,
      });
    }

    return weekDays;
  };

  const weekData = getCurrentWeek();
  const totalCompleted = weekData.reduce((sum, day) => sum + day.completed, 0);
  const totalTasks = weekData.reduce((sum, day) => sum + day.total, 0);
  const overallProgress = (totalCompleted / totalTasks) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Progresso Semanal
        </CardTitle>
        <CardDescription>
          Acompanhe seu progresso diário desta semana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium">Meta Semanal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalCompleted} de {totalTasks} tarefas concluídas
            </p>
          </div>

          <div className="text-right">
            <Badge
              variant={overallProgress >= 70 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              {Math.round(overallProgress)}%
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progresso geral</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekData.map((day, index) => {
            const dayProgress =
              day.total > 0 ? (day.completed / day.total) * 100 : 0;

            return (
              <div
                key={index}
                className={`text-center p-2 rounded-lg transition-all ${
                  day.isToday
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-muted/50"
                }`}
              >
                <div className="text-xs font-medium mb-1 capitalize">
                  {day.shortDay}
                </div>

                <div className="space-y-1">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                      dayProgress === 100
                        ? "bg-green-500 text-white"
                        : dayProgress > 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dayProgress === 100 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : day.isToday ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      day.completed
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {day.completed}/{day.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Segunda</span>
          <span>Domingo</span>
        </div>
      </CardContent>
    </Card>
  );
}
