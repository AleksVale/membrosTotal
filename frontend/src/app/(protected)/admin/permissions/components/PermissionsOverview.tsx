"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Search,
  Settings,
  Shield,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PermissionsOverviewProps {
  searchTerm: string;
  filterType: string;
}

interface RecentActivity {
  id: number;
  type: "grant" | "revoke" | "modify";
  user: {
    id: number;
    name: string;
    email: string;
  };
  resource: {
    type: "training" | "module" | "submodule";
    name: string;
    id: number;
  };
  timestamp: string;
  adminUser: string;
}

interface QuickAccess {
  id: number;
  type: "training" | "module" | "submodule";
  name: string;
  userCount: number;
  icon: React.ElementType; // Usar ElementType em vez de any
  href: string;
}

export function PermissionsOverview({
  searchTerm,
  filterType,
}: PermissionsOverviewProps) {
  const [localSearch, setLocalSearch] = useState("");

  // Simulated data - in a real app, these would come from APIs
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "grant",
      user: { id: 1, name: "João Silva", email: "joao@email.com" },
      resource: { type: "training", name: "Treinamento de Vendas", id: 1 },
      timestamp: "2025-06-11T10:30:00Z",
      adminUser: "Admin",
    },
    {
      id: 2,
      type: "revoke",
      user: { id: 2, name: "Maria Santos", email: "maria@email.com" },
      resource: { type: "module", name: "Módulo de Técnicas", id: 2 },
      timestamp: "2025-06-11T09:15:00Z",
      adminUser: "Admin",
    },
    {
      id: 3,
      type: "modify",
      user: { id: 3, name: "Pedro Costa", email: "pedro@email.com" },
      resource: { type: "submodule", name: "Submódulo de Prospecção", id: 3 },
      timestamp: "2025-06-11T08:45:00Z",
      adminUser: "Admin",
    },
  ];

  const quickAccessItems: QuickAccess[] = [
    {
      id: 1,
      type: "training",
      name: "Treinamento de Vendas",
      userCount: 45,
      icon: GraduationCap,
      href: "/admin/trainings/1/permissions",
    },
    {
      id: 2,
      type: "module",
      name: "Módulo de Técnicas",
      userCount: 32,
      icon: BookOpen,
      href: "/admin/modules/2/permissions",
    },
    {
      id: 3,
      type: "submodule",
      name: "Submódulo de Prospecção",
      userCount: 28,
      icon: FileText,
      href: "/admin/submodules/3/permissions",
    },
    {
      id: 4,
      type: "training",
      name: "Treinamento de Liderança",
      userCount: 15,
      icon: GraduationCap,
      href: "/admin/trainings/4/permissions",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "grant":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "revoke":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "modify":
        return <Settings className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: RecentActivity) => {
    const action = {
      grant: "recebeu acesso ao",
      revoke: "perdeu acesso ao",
      modify: "teve permissões modificadas no",
    }[activity.type];

    return `${action} ${activity.resource.name}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Agora há pouco";
    if (hours === 1) return "1 hora atrás";
    return `${hours} horas atrás`;
  };

  // Filtrando os itens com base no searchTerm local e no filterType
  const filteredQuickAccess = quickAccessItems.filter(
    (item) =>
      item.name.toLowerCase().includes(localSearch.toLowerCase()) &&
      (filterType === "all" || item.type === filterType.slice(0, -1))
  );

  // Filtramos as atividades com base no termo de pesquisa global
  const displayedActivities = recentActivities.filter(
    (activity) =>
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Recent Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {displayedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {activity.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {activity.user.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getActivityText(activity)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(activity.timestamp)}</span>
                      <span>•</span>
                      <span>por {activity.adminUser}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Acesso Rápido
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              className="pl-8"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {filteredQuickAccess.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => (window.location.href = item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.userCount} usuários
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Permission Summary */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Resumo de Permissões por Recurso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recurso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Usuários com Acesso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quickAccessItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.type === "training"
                          ? "Treinamento"
                          : item.type === "module"
                          ? "Módulo"
                          : "Submódulo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {item.userCount} usuários
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Ativo
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => (window.location.href = item.href)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
