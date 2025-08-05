"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Cloud,
  Moon,
  Star,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";

interface WelcomeHeaderProps {
  stats?: {
    completionRate: number;
    streak: number;
    todayTasks: number;
  };
  className?: string;
}

export function WelcomeHeader({ stats, className = "" }: WelcomeHeaderProps) {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return {
        message: "Bom dia",
        icon: <Sun className="h-5 w-5 text-yellow-500" />,
      };
    } else if (hour < 18) {
      return {
        message: "Boa tarde",
        icon: <Cloud className="h-5 w-5 text-blue-500" />,
      };
    } else {
      return {
        message: "Boa noite",
        icon: <Moon className="h-5 w-5 text-purple-500" />,
      };
    }
  };

  const getMotivationalMessage = () => {
    const completionRate = stats?.completionRate || 0;

    if (completionRate >= 80) {
      return "Excelente trabalho! Você está arrasando! 🚀";
    } else if (completionRate >= 60) {
      return "Ótimo progresso! Continue assim! 💪";
    } else if (completionRate >= 40) {
      return "Você está no caminho certo! 📈";
    } else {
      return "Vamos começar mais uma jornada de aprendizado! ✨";
    }
  };

  const greeting = getGreeting();
  const firstName = user?.name?.split(" ")[0] || "Colaborador";

  return (
    <Card
      className={`bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={user?.photo || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2 mb-1">
                {greeting.icon}
                <h2 className="text-2xl font-bold">
                  {greeting.message}, {firstName}!
                </h2>
              </div>

              <p className="text-muted-foreground mb-2">
                {getMotivationalMessage()}
              </p>

              <div className="flex items-center gap-3">
                {stats?.streak && stats.streak > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Star className="h-3 w-3" />
                    {stats.streak} dias consecutivos
                  </Badge>
                )}

                {stats?.completionRate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stats.completionRate}% de conclusão
                  </Badge>
                )}

                {stats?.todayTasks && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {stats.todayTasks} tarefas hoje
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
